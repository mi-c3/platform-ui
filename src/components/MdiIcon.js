import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';

import 'styles/affectli/style.css';

// Base icon colors for Material UI Icon component
const MAIN_COLORS = ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'];

const MdiIcon = ({ size, name, style, className, color, type, ...restProps }) => {
    let styles = useMemo(
        () => ({
            ...(style || {}),
            fontSize: size,
            height: size,
            width: size,
            lineHeight: `${size}px`,
        }),
        [style, size]
    );
    if (MAIN_COLORS.includes(color)) {
        restProps.color = color;
    } else {
        styles = { ...styles, color };
    }
    return <Icon {...restProps} className={`${className || ''} ${type} ${type}-${name}`} style={styles} />;
};

MdiIcon.propTypes = {
    ...(Icon || {}).propTypes,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
};
MdiIcon.defaultProps = {
    size: 24,
    type: 'mdi',
};

export default memo(MdiIcon);
