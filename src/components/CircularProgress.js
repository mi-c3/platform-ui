import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MuiCircularProgress from '@mui/material/CircularProgress';
import styled, { css } from 'styled-components';
import { colors } from 'styles/theme';

const fillColorCss = css`
    color: ${({ $fillColor }) => ($fillColor === 'primary' ? colors.primary.dark : `${$fillColor} !important`)};
`;

const StyledCircularProgress = styled(MuiCircularProgress)`
    ${({ $fillColor }) => ($fillColor ? fillColorCss : '')}
`;

// eslint-disable-next-line no-unused-vars
const CircularProgress = ({ classes, className, fillColor, ...restProps }) => {
    return <StyledCircularProgress className={className} $fillColor={fillColor} {...restProps} />;
};

CircularProgress.propTypes = {
    ...MuiCircularProgress.propTypes,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default memo(CircularProgress);
