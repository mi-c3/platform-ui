import React from 'react';
import PropTypes from 'prop-types';
import MdiIcon from '../../MdiIcon';

const Marker = ({ color, size, className, name }) => <MdiIcon name={name} className={className} color={color} size={size} />;

Marker.propTypes = {
    color: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
};

Marker.defaultProps = {
    color: 'primary',
    size: '36px',
    name: 'map-marker',
};

export default Marker;
