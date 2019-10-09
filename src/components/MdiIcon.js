import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';

// Base icon colors for Material UI Icon component
const MAIN_COLORS = ['inherit', 'primary', 'secondary', 'action', 'error', 'disabled'];

const MdiIcon = ({ size, name, className, color, ...restProps }) => {
    const style = {
        ...(restProps.style || {}),
        fontSize: size,
    };
    if (MAIN_COLORS.includes(color)) {
        restProps.color = color;
    } else {
        style.color = color;
    }
    return <Icon {...restProps} className={`${className || ''} mdi mdi-${name}`} style={style} />;
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
