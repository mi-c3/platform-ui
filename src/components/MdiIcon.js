import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';

// Base icon colors for Material UI Icon component
const MAIN_COLORS = ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'];

const MdiIcon = ({ size, name, style, className, color, ...restProps }) => {
    const styles = useMemo(
        () => ({
            ...(style || {}),
            fontSize: size,
            lineHeight: `${size}px`,
        }),
        [style, size]
    );
    if (MAIN_COLORS.includes(color)) {
        restProps.color = color;
    } else {
        style.color = color;
    }
    return <Icon {...restProps} className={`${className || ''} mdi mdi-${name}`} style={styles} />;
};

MdiIcon.propTypes = {
    ...(Icon || {}).propTypes,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
};
MdiIcon.defaulProps = {
    size: 24,
};

export default memo(MdiIcon);
