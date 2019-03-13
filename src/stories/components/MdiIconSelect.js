

import React from 'react';

import { MdiIcon, styled, Avatar, MdiIconSelect } from 'index';
import { createInitials } from 'stories/utils/avatar/avatar';

const SuggestionIcon = styled(MdiIcon)({
    fontSize: '19px',
});

/**
 *
 */
class MdiSelectIcon extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            icon: <Avatar>{(value || '').charAt(0).toUpperCase()}</Avatar>, //<SuggestionIcon name={value} />, // <ChipIcon name={value} />
        },
        startAdornment: <SuggestionIcon name={value} />,
        label
    });
}
class MdiSelectLetter extends MdiIconSelect {
    optionTemplate = ({ value, label }) => ({
        ChipProps: {
            avatar: <Avatar>{createInitials(value, '-')}</Avatar>,
        },
        startAdornment: <SuggestionIcon name={value} />,
        label
    });
}


export {
    MdiSelectIcon,
    MdiSelectLetter,
};
