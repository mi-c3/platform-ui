/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CircularProgress } from '@material-ui/core';

const Backdrop = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.modal.backdrop.background};
    z-index: 1300;
    @media (min-width: 960px) {
        padding: 1rem;
    }
`;

const LoadWrapper = styled.div`
    display: block;
    text-align: center;
    margin: 0 auto;
    ${({ absolute, size }) => (absolute ? `position: absolute; bottom: calc(50% - ${size / 2 || '25px'}); width: 100%; z-index: 10;` : '')};
    ${({ padding }) => (padding ? `padding: ${padding}` : '')};
`;

/**
 * Our loader/spinner component to add to places requiring a loading state
 */
class Loader extends PureComponent {
    static propTypes = {
        absolute: PropTypes.bool,
        padding: PropTypes.string,
        size: PropTypes.oneOfType([
            //  If using a number, the pixel unit is assumed. If using a string, you need to provide the CSS unit, e.g '3rem'.
            PropTypes.string,
            PropTypes.number,
        ]),
        strokeWidth: PropTypes.string,
        color: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        backdrop: PropTypes.bool,
    };

    render() {
        const { absolute, padding, size, strokeWidth, color, className, style, backdrop, ...restProps } = this.props;
        const BackdropComponent = backdrop ? Backdrop : Fragment;
        return (
            <BackdropComponent>
                <LoadWrapper
                    absolute={absolute}
                    padding={padding}
                    size={size}
                    strokeWidth={strokeWidth}
                    color={color}
                    className={`Loader ${className}`}
                    style={style}
                >
                    <CircularProgress {...restProps} size={size} />
                </LoadWrapper>
            </BackdropComponent>
        );
    }
}

export default Loader;
