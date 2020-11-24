import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MuiCircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { colors } from 'styles/theme';

const getFillColor = (opacity) => ({ fillColor }) => {
    if (fillColor === 'primary') {
        return colors.primary.dark;
    }
    if (opacity > -1) {
        return `${fillColor}${opacity} !important`;
    }
    return `${fillColor} !important`;
};

const styles = () => ({
    fillColor: {
        color: getFillColor(),
    },
});

// eslint-disable-next-line no-unused-vars
const CircularProgress = withStyles(styles)(({ classes, className, fillColor, ...restProps }) => {
    return <MuiCircularProgress className={`${fillColor && classes.fillColor} ${className}`} {...restProps} />;
});

CircularProgress.propTypes = {
    ...MuiCircularProgress.propTypes,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default memo(CircularProgress);
