import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number, select } from '@storybook/addon-knobs';

import { MdiIcon, Typography } from 'index';
import { forIcon } from 'stories/constants/propsVariation';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('MdiIcon', () => {
        const prefix = text('Prefix', '', 'Default');
        const sufix = text('Suffix', '', 'Default');
        return (
            <Fragment>
                <Typography>{prefix}</Typography>
                <MdiIcon
                    name={text('Name', 'account-plus', 'Default')}
                    size={number('Size', 32, 'Default')}
                    color={select('Color', forIcon.colors, 'primary', 'Default')}
                />
                <Typography>{sufix}</Typography>
            </Fragment>
        );
    }
    );
