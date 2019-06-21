import React from 'react';

import { MdiIcon, Avatar, MdiIconSelect } from 'index';
import { createInitials } from 'storybook/utils/avatar/avatar';

class MdiSelectIcon extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            icon: <Avatar>{(value || '').charAt(0).toUpperCase()}</Avatar>, //<MdiIcon name={value} />, // <ChipIcon name={value} />
        },
        startAdornment: <MdiIcon name={value} size={19} />,
        label,
    });
}

class MdiSelectLetter extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            avatar: <Avatar>{createInitials(value, '-')}</Avatar>,
        },
        startAdornment: <MdiIcon name={value} size={19} />,
        label,
    });
}

export { MdiSelectIcon, MdiSelectLetter };
