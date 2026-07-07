import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@mui/material';
import styled from 'styled-components';
import Link from './Link';

import MdiIcon from 'components/MdiIcon';

const ButtonIcon = styled(MdiIcon)`
    margin-top: 2px;
    margin-right: 5px;
    height: 20px;
`;

const LinkedButton = ({ to, href, ...restProps }) => {
    return to || href ? <MuiButton {...restProps} component={Link} to={to} href={href} /> : <MuiButton {...restProps} />;
};
LinkedButton.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
};

const Button = ({ iconName, iconType, children, classes, color, ...restProps }) =>
    iconName ? (
        <LinkedButton color={color} {...restProps}>
            <ButtonIcon size={15} type={iconType || 'mdi'} name={iconName} className={classes && classes.icon} />
            {children}
        </LinkedButton>
    ) : (
        <LinkedButton color={color} {...restProps}>
            {children}
        </LinkedButton>
    );
Button.propTypes = {
    iconType: PropTypes.string,
    iconName: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    to: PropTypes.string,
    href: PropTypes.string,
};

Button.defaultProps = {
    color: 'primary',
    variant: 'contained',
};

export default Button;
