import React from 'react';
import PropTypes from 'prop-types';
import MdiIcon from 'components/MdiIcon';

const Marker = ({ color = 'primary', size = '36px', className, name = 'map-marker' }) => (
    <MdiIcon name={name} className={className} color={color} size={size} />
);

Marker.propTypes = {
    color: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
};

export default Marker;
