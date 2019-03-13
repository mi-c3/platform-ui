import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import memoize from 'memoize-one';
import ReactDropzone from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

import { get } from 'utils/lo/lo';
import { isImageType, simplifySize, resizeImage } from 'utils/file/file';
import DropzoneSnackBar from 'components/Upload/DropzoneSnackBar';

const styles = ({ palette }) => ({
    dropZone: {
        position: 'relative',
        width: '100%',
        minHeight: '250px',
        cursor: 'pointer',
        boxSizing: 'border-box',
        backgroundColor: '#50575b',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    dropZoneActive: {
        backgroundColor: '#50575b90',
    },
    dropzoneTypography:{
        fontSize: '1.4rem',
        color: '#8b9194',
    },
    dropzoneIcon: {
        width: 101,
        height: 101,
        color: palette.primary[palette.type],
    },
});

class Dropzone extends Component{
    state = {
        files: [],
        openSnackbar: false,
        snackbarMessage: '',
        snackbarVariant: 'success'
    };

    componentWillUnmount(){
        if(this.props.clearOnUnmount){
            this.setState({
                files: []
            });
        }
    }

    onChange = async (files) => {
        const { onChange, imageOptions: { maxWidth, maxHeigth, quality } } = this.props;

        const postProcessFiles = files.map((file) =>
            isImageType(file.type)
                ? resizeImage({ image: file, width: maxWidth, height: maxHeigth, quality })
                : Promise.resolve(file)
        );

        const value = [];
        await Promise.all(
            postProcessFiles.map(async (prom) => {
                const blob = await prom;
                value.push(blob);
            })
        );

        onChange && onChange({ value, originalFiles: files });
    }

    handleDropAccepted = async (files) => {
        if(this.state.files.length + files.length > this.props.filesLimit) {
            return this.setState({
                openSnackbar: true,
                snackbarMessage: `Maximum allowed number of files exceeded. Only ${this.props.filesLimit} allowed`,
                snackbarVariant: 'error'
            });
        }

        this.setState({ files: this.state.files.concat(files) }, () => {
            this.onChange(files);
            let message = '';
            files.forEach((file) => {
                message += `File ${file.name} successfully added.`;
            });
            this.props.showAlerts && this.setState({
                openSnackbar: true,
                snackbarMessage: message,
                snackbarVariant: 'success'
            });
        });
    }

    handleRemove = (index) => (event) => {
        event.stopPropagation();
        const { files } = this.state;
        const fileName = get(files, `[${index}].name`);
        files.splice(index, 1);
        this.setState({ files }, () => {
            this.onChange(files);
            this.props.showAlerts && this.setState({
                openSnackbar: true,
                snackbarMessage: ('File ' + fileName + ' removed'),
                snackbarVariant: 'info'
            });
        });
    }

    handleDropRejected = (rejectedFiles, evt) => {
        let message = '';
        rejectedFiles.forEach((rejectedFile) => {
            message = `File ${rejectedFile.name} was rejected. `;
            if(!this.props.acceptedFiles.includes(rejectedFile.type)){
                message += 'File type not supported. ';
            }
            if(rejectedFile.size > Number(this.props.fileSizeLimit)){
                message += `File is too big. Size limit is ${simplifySize(this.props.fileSizeLimit)}. `;
            }
        });
        if(this.props.onDropRejected){
            this.props.onDropRejected(rejectedFiles, evt);
        }
        this.props.showAlerts && this.setState({
            openSnackbar: true,
            snackbarMessage: message,
            snackbarVariant: 'error'
        });
    }

    onCloseSnackbar = () => this.setState({
        openSnackbar: false,
    });

    buildFilesList =  memoize(({ files }) => files.map((file, index) => (
        <ListItem key={index}>
            {isImageType(files[index].type) ?
                <Avatar src={URL.createObjectURL(file)} />
                : (<Avatar><AttachFileIcon /></Avatar>)
            }
            <ListItemText primary={files[index].name} secondary={files[index].type} />
            <ListItemSecondaryAction>
                <IconButton onClick={this.handleRemove(index)} aria-label="Delete">
                    <CancelIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )))

    render(){
        const { classes, capture, showPreviews, dropzoneText, dropzoneTextHover, multiple, ...restProps } = this.props;
        const { files } = this.state;
        return (
            <Fragment>
                <ReactDropzone
                    {...restProps}
                    onDropAccepted={this.handleDropAccepted}
                    onDropRejected={this.handleDropRejected}
                >
                    {({getRootProps, getInputProps, isDragActive}) => {
                        return (
                            <div
                                {...getRootProps()}
                                className={`${classes.dropZone} ${isDragActive && classes.dropZoneActive}`}
                            >
                                <input {...getInputProps()} capture={capture} multiple={multiple} />
                                <CloudUploadIcon className={classes.dropzoneIcon}/>
                                {
                                    isDragActive ?
                                        <Typography className={classes.dropzoneTypography}>{dropzoneTextHover}</Typography> :
                                        <Typography className={classes.dropzoneTypography}>{dropzoneText}</Typography>
                                }
                            </div>
                        );
                    }}
                </ReactDropzone>
                {showPreviews && (
                    <List>
                        {this.buildFilesList({ files })}
                    </List>
                )}
                {this.props.showAlerts &&
                    <DropzoneSnackBar
                        open={this.state.openSnackbar}
                        autoHideDuration={6000}
                        onClose={this.onCloseSnackbar}
                        variant={this.state.snackbarVariant}
                        message={this.state.snackbarMessage}
                    />
                }
            </Fragment>
        );
    }
}

Dropzone.defaultProps = {
    accept: 'image/*,video/*,application/*',
    imageOptions: {},
    filesLimit: 3,
    capture: true,
    maxSize: 3000000,
    dropzoneTextHover: 'Drop files here...',
    dropzoneText: 'Drag an image here',
    showPreviews: true, // By default previews show up under in the dialog and inside in the standalone
    showAlerts: true,
    clearOnUnmount: true,
};
Dropzone.propTypes = {
    accept: PropTypes.string,
    filesLimit: PropTypes.number,
    maxSize: PropTypes.number,
    dropzoneTextHover: PropTypes.string,
    dropzoneText: PropTypes.string,
    capture: PropTypes.bool,
    showPreviews: PropTypes.bool,
    showAlerts: PropTypes.bool,
    clearOnUnmount: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onDropRejected: PropTypes.func,
    onDelete: PropTypes.func
};
export default withStyles(styles)(Dropzone);
