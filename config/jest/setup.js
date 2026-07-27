// jsdom ships without TextEncoder/TextDecoder; react-router 8 needs them
// (its server-runtime crypto module reads them at import time).
const { TextEncoder, TextDecoder } = require('util');

if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoder;
    globalThis.TextDecoder = TextDecoder;
}
