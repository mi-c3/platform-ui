import React from 'react';
import PropTypes from 'prop-types';
import Place from '@material-ui/icons/Place';

const SimpleMarker = ({ color, fontSize }) => <Place color={color} fontSize={fontSize} />;

SimpleMarker.propTypes = {
    color: PropTypes.string,
    fontSize: PropTypes.string,
};

SimpleMarker.defaultProps = {
    color: 'primary',
    fontSize: 'large',
};

export { SimpleMarker };
