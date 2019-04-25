/* @flow */

/**
 * Creates an event.
 *
 * @param type the type of event to create.
 * @param target the value to se in the target property.
 */
const createEvent = (type, body) => {
    const event = new Event(type);
    Object.entries(body).forEach(([key, value]) => window.Object.defineProperty(event, key, { value }));
    return event;
};

export { createEvent };
