import React from 'react';
import PropTypes from 'prop-types';
import MuiAvatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import { createInitials, generateColor } from 'utils/avatar/avatar';

const styles = () => ({
    primary: { backgroundColor: '#00a99d' },
    secondary: { backgroundColor: '#066ab1' },
    info: { backgroundColor: '#4FC3F7' },
    success: { backgroundColor: '#81C784' },
    warning: { backgroundColor: '#FF8A65' },
    alert: { backgroundColor: '#FFC107' },
    danger: { backgroundColor: '#FF5722' },
    error: { backgroundColor: '#c62828' },
});

const Avatar = ({ initials, src, classes, className, initialsSeparator, ...restProps }) => {
    return src ? (
        <MuiAvatar src={src} className={className || ''} {...restProps} />
    ) : (
        <MuiAvatar className={`${generateColor(Object.values(classes), initials)} ${className || ''}`} {...restProps}>
            {createInitials(initials, initialsSeparator)}
        </MuiAvatar>
    );
};

Avatar.propTypes = {
    initials: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    initialsSeparator: PropTypes.string,
    classes: PropTypes.object,
};

export default withStyles(styles)(Avatar);
