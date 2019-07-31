import React from 'react';
import PropTypes from 'prop-types';
import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import MdiIcon from 'components/MdiIcon';

const useStyles = withStyles({
    icon: {
        marginTop: '-4px',
        marginRight: '5px',
        height: '20px',
    },
});
const Button = ({ iconName, children, classes, color, ...restProps }) =>
    iconName ? (
        <MuiButton color={color} {...restProps}>
            <MdiIcon size={15} name={iconName} className={classes.icon} />
            {children}
        </MuiButton>
    ) : (
        <MuiButton color={color} {...restProps}>
            {children}
        </MuiButton>
    );
Button.propTypes = {
    iconName: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
};

Button.defaultProps = {
    color: 'primary',
    variant: 'contained',
};

export default useStyles(Button);
