import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number, select } from '@storybook/addon-knobs';

import { MdiIcon, Typography, List, ListItem, ListItemText, ListItemIcon } from 'index';
import { forIcon } from 'storybook/constants/propsVariation';

storiesOf('Components|MdiIcon', module)
    .addDecorator(withKnobs)
    .add('MdiIcon', () => {
        const prefix = text('Prefix', '', 'Default');
        const sufix = text('Suffix', '', 'Default');
        const name = text('Name', 'account-plus', 'Default');
        const size = number('Size', 32, 'Default');
        const color = select('Color', forIcon.colors, 'primary', 'Default');
        return (
            <Fragment>
                <Typography>{prefix}</Typography>
                <MdiIcon name={name} size={size} color={color} />
                <Typography>{sufix}</Typography>
                <List>
                    <ListItem ContainerComponent="div" dense disableGutters>
                        <ListItemIcon>
                            <MdiIcon name="account-circle" />
                        </ListItemIcon>
                        <ListItemText primary="account-circle" />
                    </ListItem>
                    <ListItem ContainerComponent="div" dense disableGutters>
                        <ListItemIcon>
                            <MdiIcon name="account-circle" />
                        </ListItemIcon>
                        <ListItemText primary="account-circle" />
                    </ListItem>
                    <ListItem ContainerComponent="div" dense disableGutters>
                        <ListItemIcon>
                            <MdiIcon name="account-circle" />
                        </ListItemIcon>
                        <ListItemText primary="account-circle" />
                    </ListItem>
                    <ListItem ContainerComponent="div" dense disableGutters>
                        <ListItemIcon>
                            <MdiIcon name="account-circle" />
                        </ListItemIcon>
                        <ListItemText primary="account-circle" />
                    </ListItem>
                </List>
            </Fragment>
        );
    });
