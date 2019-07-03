import React from 'react';

import { MdiIcon, Avatar, MdiIconSelect } from 'index';
import { createInitials } from 'utils/avatar/avatar';
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
            // avatar: <Avatar className={this.props.classes.avatar}>{(value || '').charAt(0).toUpperCase()}</Avatar>, //<MdiIcon name={value} />, // <ChipIcon name={value} />
            icon: <MdiIcon name={value} size={19} />,
        },
        startAdornment: <MdiIcon name={value} size={19} />,
        label,
    });
}

const MdiSelectIcon = withStyles(styles)(MdiSelectIconClass);

class MdiSelectLetterClass extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            avatar: <Avatar className={this.props.classes.avatar}>{createInitials(value, '-')}</Avatar>,
        },
        startAdornment: <MdiIcon name={value} size={19} />,
        label,
    });
}

const MdiSelectLetter = withStyles(styles)(MdiSelectLetterClass);

export { MdiSelectIcon, MdiSelectLetter };
