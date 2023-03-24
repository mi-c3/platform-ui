import { get } from './lo/lo';
import marked from 'marked';
import DOMPurify from 'dompurify';

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const shallowEquals = (objA, objB, fields) => {
    if (!objA && !objB) {
        return true;
    }
    if (!objA || !objB) {
        return false;
    }
    const keys = fields || Object.keys(objA);
    if (!fields && keys.length !== Object.keys(objB).length) {
        return false;
    }
    return !keys.some((key) => get(objA, key) !== get(objB, key));
};

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const isDefined = (value) => value !== null && value !== undefined;

/**
 * Safe way to cast a value as array. If the value is not defined null will be returned.
 *
 * @param value The value to cast.
 * @return the value as array or null.
 */
const arrayfy = (value) => {
    if (!isDefined(value)) {
        return null;
    }
    return Array.isArray(value) ? value : [value];
};

const markdown = (text) => marked.parse(DOMPurify.sanitize(text));

export { isObject, shallowEquals, debounce, arrayfy, isDefined, markdown };
