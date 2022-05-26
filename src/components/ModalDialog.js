import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Divider, Dialog, Grid, IconButton, Typography } from '@material-ui/core';

import Loader from './Loader';
import MdiIcon from './MdiIcon';

const DialogStyled = styled(Dialog)`
    & .MuiDialog-paper {
        padding: 16px;
        background-color: ${({ bgcolor }) => (bgcolor ? bgcolor : 'rgba(40, 51, 75, 1)')};
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

const Content = styled(Grid)`
    overflow: ${({ overflow }) => (overflow ? overflow : 'auto')};
    min-height: 60px;
`;

const StyledSmall = styled.small`
    padding-top: 10px;
`;

const DialogFooter = styled.div`
    margin-top: 6px;
`;

const ModalDialog = ({
    title,
    subtitle,
    children,
    actions,
    withoutClose,
    onClose,
    closeIcon,
    dialogProps = {},
    isLoading,
    fullScreen,
    bgcolor,
    footer,
}) => {
    const { overflow } = dialogProps;
    return (
        <DialogStyled
            fullScreen={fullScreen}
            open={true}
            onClose={() => {
                /* We don't want to close modals when we click outside of modal */
            }}
            fullWidth
            maxWidth="md"
            bgcolor={bgcolor}
            {...dialogProps}
        >
            <Grid container justify="space-between" alignItems="center">
                <Grid item container xs={8} alignItems="center" wrap="nowrap">
                    {!withoutClose && (
                        <IconButton aria-label="close" onClick={onClose}>
                            <MdiIcon name={closeIcon ? closeIcon : 'close'} />
                        </IconButton>
                    )}
                    <Typography variant="h6">{title}</Typography>
                    <StyledSmall>{subtitle}</StyledSmall>
                </Grid>
                <Grid item container xs={4} justify="flex-end" alignItems="center">
                    {actions}
                </Grid>
            </Grid>
            <Content overflow={overflow}>
                <Divider />
                {isLoading ? <Loader /> : children}
            </Content>
            {footer && (
                <DialogFooter>
                    <Divider />
                    {footer}
                </DialogFooter>
            )}
        </DialogStyled>
    );
};
ModalDialog.propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    subtitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    children: PropTypes.node,
    action: PropTypes.node,
    dialogProps: PropTypes.object,
    onClose: PropTypes.func,
    fullScreen: PropTypes.bool,
    withoutClose: PropTypes.bool,
    footer: PropTypes.node,
    bgcolor: PropTypes.string,
    actions: PropTypes.node,
    closeIcon: PropTypes.string,
    closeIconType: PropTypes.string,
    isLoading: PropTypes.bool,
};

export default ModalDialog;
