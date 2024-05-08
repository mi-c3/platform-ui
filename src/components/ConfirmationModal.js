/* @flow */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';
import Button from './Button';

const DialogStyled = styled(Dialog)`
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.08), 0px 22px 12px rgba(0, 0, 0, 0.26);
    border-radius: 2px;

    & .MuiDialog-paper {
        background-color: #28334b;
    }
    *::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }
    *::-webkit-scrollbar-thumb {
        border-radius: 5px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: rgba(255, 255, 255, 0.2);
        min-height: 65px;
    }
    *::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 0;
        background-color: transparent;
    }
`;

const ConfirmationModal = ({
    draftEvent,
    maxWidth,
    fullWidth,
    onConfirm,
    onClose,
    open,
    header,
    message,
    declineButtonText,
    confirmButtonText,
    confirmButtonDisabled,
    noDecline,
    noCloseOnConfirm,
    declineButtonProps,
}) => {
    const handleConfirm = useCallback(
        (e) => {
            !noCloseOnConfirm && onClose(e);
            onConfirm(draftEvent || e);
        },
        [onClose, onConfirm, draftEvent, noCloseOnConfirm]
    );
    return (
        <>
            <DialogStyled
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={maxWidth}
                fullWidth={fullWidth}
            >
                <DialogTitle id="alert-dialog-title">{header}</DialogTitle>
                <DialogContent>{message}</DialogContent>
                <DialogActions>
                    {!noDecline && (
                        <Button onClick={onClose} color="secondary" variant="text" {...(declineButtonProps || {})}>
                            {declineButtonText}
                        </Button>
                    )}
                    <Button disabled={confirmButtonDisabled} onClick={onConfirm ? handleConfirm : onClose} color="primary" variant="text">
                        {confirmButtonText}
                    </Button>
                </DialogActions>
            </DialogStyled>
        </>
    );
};

ConfirmationModal.propTypes = {
    declineButtonProps: PropTypes.object,
    draftEvent: PropTypes.object,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // 'lg' | 'md | 'sm' | 'xl' | 'xs' | false
    fullWidth: PropTypes.bool,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    header: PropTypes.string,
    message: PropTypes.string,
    declineButtonText: PropTypes.string,
    confirmButtonText: PropTypes.string,
    confirmButtonDisabled: PropTypes.bool,
    noDecline: PropTypes.bool,
    noCloseOnConfirm: PropTypes.bool,
};
export default ConfirmationModal;
