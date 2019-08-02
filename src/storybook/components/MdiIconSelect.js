import React from 'react';

import { MdiIcon, Avatar, MdiIconSelect, ListItem, ListItemText, ListItemIcon } from 'index';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    avatar: {
        width: '21px',
        height: '21px',
        fontSize: '.95rem',
    },
});

class MdiSelectIconClass extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            icon: <MdiIcon name={value} size={19} />,
        },
        startAdornment: <MdiIcon name={value} size={19} />,
        label,
        option: (
            <ListItem ContainerComponent="div" dense disableGutters>
                <ListItemIcon>
                    <MdiIcon name={value} />
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
        ),
    });
}

const MdiSelectIcon = withStyles(styles)(MdiSelectIconClass);

class MdiSelectLetterClass extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            avatar: <Avatar initialsSeparator="-" initials={value} className={this.props.classes.avatar} />,
        },
        startAdornment: <MdiIcon name={value} size={19} />,
        label,
        option: (
            <ListItem ContainerComponent="div" dense disableGutters>
                <ListItemIcon>
                    <MdiIcon name={value} />
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
        ),
    });
}

const MdiSelectLetter = withStyles(styles)(MdiSelectLetterClass);

export { MdiSelectIcon, MdiSelectLetter };
