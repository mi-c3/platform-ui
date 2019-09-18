import React from 'react';
import PropTypes from 'prop-types';
import MuiAvatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/styles';
import { createInitials, generateColor } from 'utils/avatar/avatar';
import CircularProgressStatic from './CircularProgressStatic';
import { isDefined } from 'utils/utils';
import { colors } from 'styles/theme';

const styles = () => ({
    primary: { backgroundColor: '#00a99d !important' },
    secondary: { backgroundColor: '#066ab1 !important' },
    info: { backgroundColor: '#4FC3F7 !important' },
    success: { backgroundColor: '#81C784 !important' },
    warning: { backgroundColor: '#FF8A65 !important' },
    alert: { backgroundColor: '#FFC107 !important' },
    danger: { backgroundColor: '#FF5722 !important' },
    error: { backgroundColor: '#c62828 !important' },
    avatarClassName: {
        '& img:after': {
            content: `"\\F2EE"`,
            font: 'normal normal normal 24px/1 "Material Design Icons"',
            color: colors.common.white,
            userSelect: 'none',
            flexShrink: 0,
            position: 'absolute',
            top: '0px',
            left: '0px',
            backgroundColor: colors.background,
            width: '100%',
            height: '100%',
        },
    },
});

const Avatar = withStyles(styles)(({ initials, src, classes, className, initialsSeparator, ...restProps }) => {
    const { avatarClassName, ...colorClassNames } = classes;
    return src ? (
        <MuiAvatar src={src} className={`${avatarClassName} ${className || ''}`} {...restProps} />
    ) : (
        <MuiAvatar
            className={`${generateColor(Object.values(colorClassNames), initials)} ${avatarClassName} ${className || ''}`}
            {...restProps}
        >
            {createInitials(initials, initialsSeparator)}
        </MuiAvatar>
    );
});

const circulaStyles = () => ({
    avatarWithCircular: {
        width: `28px !important`,
        height: `28px !important`,
    },
});
const CirculaAvatar = withStyles(circulaStyles)(({ classes, className, CircularProgressStaticProps, ...restProps }) => {
    return isDefined(CircularProgressStaticProps.value) ? (
        <CircularProgressStatic
            fillColor="primary"
            size={40}
            {...CircularProgressStaticProps}
            foreignObjectContent={<Avatar className={`${classes.avatarWithCircular} ${className}`} {...restProps} />}
            className={`${classes.circularProgress} ${CircularProgressStaticProps.className}`}
        />
    ) : (
        <Avatar className={className} {...restProps} />
    );
});

Avatar.propTypes = {
    initials: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    initialsSeparator: PropTypes.string,
    classes: PropTypes.object,
};

CirculaAvatar.defaultProps = {
    CircularProgressStaticProps: {},
};

export default CirculaAvatar;
