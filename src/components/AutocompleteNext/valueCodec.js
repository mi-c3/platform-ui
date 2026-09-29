import equals from 'fast-deep-equal';

import { get } from 'utils/lo/lo';

/**
 * Pure helpers translating between the platform value contract and MUI Autocomplete's
 * option-based model.
 *
 * The platform contract (unchanged from the legacy Autocomplete):
 *   - without `valueField` the stored value IS the option object;
 *   - with `valueField` the stored value is the option's field (usually a primitive:
 *     `name`, `uri`, `id`, `value`).
 *
 * MUI wants the *option* as its `value`, so a stored primitive must be resolved back to an
 * option. When the option list does not (yet) contain it — async lists are loaded on demand
 * and may be replaced at any time by unrelated store updates — the selected-option cache
 * keeps the last known option for the value so the label survives options churn.
 */

/** The stored value an option maps to. */
export const optionValue = (option, valueField) => (valueField ? get(option, valueField) : option);

/** Find the option matching a stored value; undefined when absent. */
export const findOption = (options, value, valueField) =>
    (options || []).find(option => equals(optionValue(option, valueField), value));

/**
 * Resolve a stored value to the option MUI should hold.
 * Resolution order: current options → selected-option cache → the raw value itself
 * (an object value is already option-shaped; a primitive falls back to a placeholder the
 * option template may resolve, exactly as the legacy component handed unmatched values to
 * `optionTemplate`).
 * `''` and `null` are looked up like any other value, as 1.x did: an option holding one (e.g.
 * `{ value: '', label: 'Always latest version' }`) is the selection. Only when nothing holds it
 * are they the empty state. `undefined` is always empty — an option lacking `valueField` reads
 * as `undefined` and must not match.
 */
export const resolveOption = (value, options, cache, valueField) => {
    if (value === undefined) {
        return null;
    }
    const found = findOption(options, value, valueField);
    if (found !== undefined) {
        return found;
    }
    if (valueField && cache && cache.has(value)) {
        return cache.get(value);
    }
    return value === null || value === '' ? null : value;
};

/** Resolve a multi-select stored value (array) to MUI's option array. */
export const resolveOptions = (value, options, cache, valueField) =>
    (Array.isArray(value) ? value : value ? [value] : []).map(item => resolveOption(item, options, cache, valueField));

/** The value to store for a selected option (placeholders pass through unchanged). */
export const fromOption = (option, valueField) => {
    if (option === null || option === undefined) {
        return null;
    }
    if (valueField && typeof option === 'object') {
        return get(option, valueField, null);
    }
    return option;
};

/**
 * Equality between an option and a resolved value for MUI's `isOptionEqualToValue`.
 * The resolved value can be a placeholder primitive when no option matched it yet.
 */
export const isOptionEqualToValue = (option, value, valueField) => {
    const optionSide = optionValue(option, valueField);
    const valueSide = valueField && typeof value !== 'object' ? value : optionValue(value, valueField);
    return equals(optionSide, valueSide);
};

/** Stable option identity for MUI's `getOptionKey`. */
export const getOptionKey = (option, valueField) => {
    if (option === null || option === undefined) {
        return '';
    }
    if (typeof option !== 'object') {
        return option;
    }
    if (valueField) {
        const key = get(option, valueField);
        if (key !== null && key !== undefined && typeof key !== 'object') {
            return key;
        }
    }
    if (option.id !== null && option.id !== undefined) {
        return option.id;
    }
    return option.label;
};
