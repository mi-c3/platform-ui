import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

import Dropzone from 'components/Upload/Dropzone';
import { bind } from 'utils/decorators/decoratorUtils';

// FIXME checkout https://mui.com/components/use-media-query/#using-material-uis-breakpoint-helpers
const withMobileDialog = () => (WrappedComponent) => (props) => <WrappedComponent width="lg" fullScreen={false} {...props} />;

const DialogActionsStyled = styled(DialogActions)({
    minWidth: 300,
});

class DropzoneDialog extends PureComponent {
    @bind
    onSave() {
        const { onSave, onClose, value } = this.props;
        if (onSave) {
            onSave(value);
            onClose();
        }
    }

    render() {
        const { open, title, onClose, fullScreen, ...restProps } = this.props;
        return (
            <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
                {title && <DialogTitle>{title}</DialogTitle>}
                <Dropzone showPreviews={false} showPreviewsInDropzone={false} showAlerts={false} {...restProps} />
                <DialogActionsStyled>
                    <Button onClick={onClose} variant="text">
                        Cancel
                    </Button>
                    <Button onClick={this.onSave} variant="text">
                        Save
                    </Button>
                </DialogActionsStyled>
            </Dialog>
        );
    }
}

DropzoneDialog.defaultProps = {
    open: false,
    title: 'Upload File',
};
DropzoneDialog.propTypes = {
    ...(Dropzone || {}).propTypes,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
};

export default withMobileDialog()(DropzoneDialog);
