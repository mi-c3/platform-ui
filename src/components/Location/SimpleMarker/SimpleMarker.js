import React from 'react';
import Place from '@material-ui/icons/Place';

export const SimpleMarker = ({ color, fontSize }) => (
    <Place color={color} fontSize={fontSize}/>
);

SimpleMarker.defaultProps = {
    color: 'primary',
    fontSize: 'large',
};
