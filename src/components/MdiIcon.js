import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@material-ui/core/Icon';

const MdiIcon = ({ size, name, className, ...restProps }) => (
    <Icon
        {...restProps}
        className={`${className || ''} mdi mdi-${name}`}
        style={{
            ...(restProps.style || {}),
            fontSize: size
        }}
    />
);

MdiIcon.propTypes = {
    ...Icon.propTypes,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.number,
};

export default MdiIcon;
