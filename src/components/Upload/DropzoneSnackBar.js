import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import WarningIcon from '@mui/icons-material/Warning';
import Snackbar from '@mui/material/Snackbar';

import { green, amber } from '@mui/material/colors';

import { DarkTheme } from 'styles/theme';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const variantBackgroundColor = {
    success: green[600],
    error: DarkTheme.palette.error[DarkTheme.palette.mode],
    info: DarkTheme.palette.primary[DarkTheme.palette.mode],
    warning: amber[700],
};

const SnackbarContentStyled = styled(SnackbarContent)`
    &.MuiSnackbarContent-root {
        background-color: ${({ $variant }) => variantBackgroundColor[$variant]};
    }
`;

const MessageStyled = styled.span`
    display: flex;
    align-items: center;

    & > svg {
        opacity: 0.9;
        margin-right: ${DarkTheme.spacing(1)};
    }
`;

const CloseIconStyled = styled(CloseIcon)`
    font-size: 20px;
`;

const DropzoneSnackBar = (props) => {
    const { className, message, onClose, variant, open, autoHideDuration } = props;
    const Icon = variantIcon[variant];
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
        >
            <SnackbarContentStyled
                $variant={variant}
                className={className}
                aria-describedby="client-snackbar"
                message={
                    <MessageStyled id="client-snackbar">
                        <Icon />
                        {message}
                    </MessageStyled>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={onClose}
                        size="large">
                        <CloseIconStyled />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    );
};

DropzoneSnackBar.propTypes = {
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    open: PropTypes.bool,
    autoHideDuration: PropTypes.number,
};

export default DropzoneSnackBar;
