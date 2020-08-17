import { markdown } from '../../src';

describe('markdown', () => {
    test('markdown is clear from XSS scripts', () => {
        const withXssScript = '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>';
        expect(markdown(withXssScript)).toBe('<p>abc</p>');
    });
});
