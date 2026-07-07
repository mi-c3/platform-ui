import React from 'react';
import PropTypes from 'prop-types';
import MuiAvatar from '@mui/material/Avatar';
import styled, { css } from 'styled-components';
import { createInitials, generateColor } from 'utils/avatar/avatar';
import CircularProgressStatic from './CircularProgressStatic';
import { isDefined } from 'utils/utils';
import { colors } from 'styles/theme';

const avatarColors = [
    '#00a99d', // primary
    '#066ab1', // secondary
    '#4FC3F7', // info
    '#81C784', // success
    '#FF8A65', // warning
    '#FFC107', // alert
    '#FF5722', // danger
    '#c62828', // error
];

const StyledAvatar = styled(MuiAvatar)`
    ${({ $backgroundColor }) => $backgroundColor && css`
        background-color: ${$backgroundColor} !important;
    `}
    & img:after {
        content: '\\F2EE';
        font: normal normal normal 24px/1 'Material Design Icons';
        color: ${colors.common.white};
        user-select: none;
        flex-shrink: 0;
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: ${colors.background};
        width: 100%;
        height: 100%;
    }
`;

const Avatar = ({ initials, src, className, initialsSeparator, ...restProps }) => {
    if (!src && initials) {
        return (
            <StyledAvatar $backgroundColor={generateColor(avatarColors, initials)} className={className} {...restProps}>
                {createInitials(initials, initialsSeparator)}
            </StyledAvatar>
        );
    }
    return <StyledAvatar src={src} className={className} {...restProps} />;
};

const AvatarWithCircular = styled(Avatar)`
    width: 28px !important;
    height: 28px !important;
`;

const CirculaAvatar = ({ className, CircularProgressStaticProps, ...restProps }) => {
    return isDefined(CircularProgressStaticProps.value) ? (
        <CircularProgressStatic
            fillColor="primary"
            size={40}
            {...CircularProgressStaticProps}
            foreignObjectContent={<AvatarWithCircular className={className} {...restProps} />}
            className={CircularProgressStaticProps.className}
        />
    ) : (
        <Avatar className={className} {...restProps} />
    );
};

Avatar.propTypes = {
    initials: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    initialsSeparator: PropTypes.string,
};

CirculaAvatar.propTypes = {
    className: PropTypes.string,
    CircularProgressStaticProps: PropTypes.object,
};

CirculaAvatar.defaultProps = {
    CircularProgressStaticProps: {},
};

export default CirculaAvatar;
