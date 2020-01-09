import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TextEditor from 'components/TextEditor';

const exampleValue = `
# h1
## h2
### h4
#### h5
**bold**
*italic*
~~crossed~~
[MI-C3](http://mi-c3.com/)
> qoute

some \`highlight\` word

\`\`\`
function getHelloWorld() {
  return 'Hello World';
}
\`\`\`

- line one
- line two

1. one
2. two

- [] checked N1
- [] checked N2

![](https://mi-c3.com/wp-content/uploads/2018/04/Earthday-201810-1-600x400.jpg)

`;
storiesOf('Components|Editors', module)
    .addDecorator(withKnobs)
    .add('TextEditor', () => (
        <Fragment>
            <TextEditor onChange={action('onChange')} value={exampleValue} />
        </Fragment>
    ));
