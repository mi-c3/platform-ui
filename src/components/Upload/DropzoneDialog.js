import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { styled } from '@material-ui/styles';

import Dropzone from './Dropzone';
import { bind } from '../../utils/decorators/decoratorUtils';

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
