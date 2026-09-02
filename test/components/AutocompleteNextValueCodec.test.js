import {
    optionValue,
    findOption,
    resolveOption,
    resolveOptions,
    fromOption,
    isOptionEqualToValue,
    getOptionKey,
} from '../../src/components/AutocompleteNext/valueCodec';

const OPTIONS = [
    { id: '1', name: 'Alice', uri: 'user/alice' },
    { id: '2', name: 'Bob', uri: 'user/bob' },
];

describe('optionValue', () => {
    test('returns the option itself without valueField', () => {
        expect(optionValue(OPTIONS[0])).toBe(OPTIONS[0]);
    });
    test('extracts the field with valueField', () => {
        expect(optionValue(OPTIONS[0], 'name')).toBe('Alice');
    });
    test('supports nested paths', () => {
        expect(optionValue({ a: { b: 7 } }, 'a.b')).toBe(7);
    });
});

describe('findOption', () => {
    test('finds by primitive valueField', () => {
        expect(findOption(OPTIONS, 'user/bob', 'uri')).toBe(OPTIONS[1]);
    });
    test('finds object values by deep equality, not identity', () => {
        expect(findOption(OPTIONS, { id: '1', name: 'Alice', uri: 'user/alice' })).toBe(OPTIONS[0]);
    });
    test('returns undefined when absent', () => {
        expect(findOption(OPTIONS, 'nope', 'uri')).toBeUndefined();
        expect(findOption(null, 'x', 'uri')).toBeUndefined();
    });
});

describe('resolveOption', () => {
    test('null/undefined/empty resolve to null', () => {
        expect(resolveOption(null, OPTIONS, null, 'name')).toBeNull();
        expect(resolveOption(undefined, OPTIONS, null, 'name')).toBeNull();
        expect(resolveOption('', OPTIONS, null, 'name')).toBeNull();
    });
    test('prefers the matching option from the current list', () => {
        expect(resolveOption('Alice', OPTIONS, new Map(), 'name')).toBe(OPTIONS[0]);
    });
    test('falls back to the selected-option cache when options miss the value', () => {
        const cached = { id: '9', name: 'Zoe' };
        const cache = new Map([['Zoe', cached]]);
        expect(resolveOption('Zoe', [], cache, 'name')).toBe(cached);
        // the label must survive options being REPLACED by churn, not only emptied
        expect(resolveOption('Zoe', OPTIONS, cache, 'name')).toBe(cached);
    });
    test('falls back to the raw value as placeholder when nothing matches', () => {
        expect(resolveOption('Ghost', [], new Map(), 'name')).toBe('Ghost');
    });
    test('object value without valueField is itself the option', () => {
        const value = { id: '3', name: 'Carol' };
        expect(resolveOption(value, OPTIONS, null, undefined)).toBe(value);
    });
});

describe('resolveOptions (multiple)', () => {
    test('maps an array of stored values', () => {
        const cache = new Map();
        expect(resolveOptions(['Alice', 'Bob'], OPTIONS, cache, 'name')).toEqual([OPTIONS[0], OPTIONS[1]]);
    });
    test('null becomes an empty array', () => {
        expect(resolveOptions(null, OPTIONS, null, 'name')).toEqual([]);
    });
    test('a scalar is arrayfied (defensive parity with the legacy component)', () => {
        expect(resolveOptions('Alice', OPTIONS, null, 'name')).toEqual([OPTIONS[0]]);
    });
});

describe('fromOption', () => {
    test('extracts the stored value with valueField', () => {
        expect(fromOption(OPTIONS[0], 'uri')).toBe('user/alice');
    });
    test('whole option without valueField', () => {
        expect(fromOption(OPTIONS[0])).toBe(OPTIONS[0]);
    });
    test('null stays null', () => {
        expect(fromOption(null, 'uri')).toBeNull();
    });
    test('a placeholder primitive passes through', () => {
        expect(fromOption('Ghost', 'name')).toBe('Ghost');
    });
});

describe('isOptionEqualToValue', () => {
    test('object mode compares deeply', () => {
        expect(isOptionEqualToValue(OPTIONS[0], { ...OPTIONS[0] })).toBe(true);
        expect(isOptionEqualToValue(OPTIONS[0], OPTIONS[1])).toBe(false);
    });
    test('valueField mode compares fields between two options', () => {
        expect(isOptionEqualToValue(OPTIONS[0], { name: 'Alice' }, 'name')).toBe(true);
    });
    test('valueField mode accepts a placeholder primitive on the value side', () => {
        expect(isOptionEqualToValue(OPTIONS[0], 'Alice', 'name')).toBe(true);
        expect(isOptionEqualToValue(OPTIONS[0], 'Bob', 'name')).toBe(false);
    });
});

describe('getOptionKey', () => {
    test('valueField key when primitive', () => {
        expect(getOptionKey(OPTIONS[0], 'uri')).toBe('user/alice');
    });
    test('id fallback', () => {
        expect(getOptionKey({ id: '7', label: 'x' })).toBe('7');
    });
    test('label fallback', () => {
        expect(getOptionKey({ label: 'x' })).toBe('x');
    });
    test('placeholder primitive is its own key', () => {
        expect(getOptionKey('Ghost', 'name')).toBe('Ghost');
    });
});
