import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { get } from 'utils/lo/lo';
import { isImageType, simplifySize, resizeImage } from 'utils/file/file';
import DropzoneSnackBar from 'components/Upload/DropzoneSnackBar';
import MdiIcon from 'components/MdiIcon';

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
    relative: {
        position: 'relative',
    },
    dropZoneActive: {
        backgroundColor: '#50575b90',
    },
    dropzoneTypography: {
        fontSize: '1.4rem',
        color: 'white',
    },
    dropzoneIcon: {
        width: 101,
        height: 101,
        color: palette.primary[palette.type],
    },
    dropzoneBounceIcon: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#50575bf0',
        flexDirection: 'column',
        zIndex: 99,
    },
});

class Dropzone extends PureComponent {
    static defaultProps = {
        accept: 'image/*,video/*,application/*',
        imageOptions: null,
        filesLimit: 1,
        capture: true,
        maxSize: 3000000,
        dropzoneTextHover: 'Drop files here...',
        dropzoneText: 'Drag an image here',
        showPreviews: false, // By default previews show up under in the dialog and inside in the standalone
        showAlerts: false,
        clearOnUnmount: true,
    };

    static propTypes = {
        ...(ReactDropzone || {}).propTypes,
        accept: PropTypes.string,
        filesLimit: PropTypes.number,
        maxSize: PropTypes.number,
        dropzoneTextHover: PropTypes.string,
        dropzoneText: PropTypes.string,
        capture: PropTypes.bool,
        showPreviews: PropTypes.bool,
        showAlerts: PropTypes.bool,
        clearOnUnmount: PropTypes.bool,
        onChange: PropTypes.func,
        onDropRejected: PropTypes.func,
        onDelete: PropTypes.func,
        imageOptions: PropTypes.shape({
            maxWidth: PropTypes.number,
            maxHeigth: PropTypes.number,
            quality: PropTypes.number,
        }),
        acceptedFiles: PropTypes.arrayOf(PropTypes.string),
        fileSizeLimit: PropTypes.number,
        classes: PropTypes.object,
        multiple: PropTypes.bool,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    };

    constructor(props) {
        super(props);
        this.state = {
            files: props.value || [],
            openSnackbar: false,
            snackbarMessage: '',
            snackbarVariant: 'success',
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                files: this.props.value,
            });
        }
    }

    componentWillUnmount() {
        if (this.props.clearOnUnmount) {
            this.setState({
                files: [],
            });
        }
    }

    @bind
    async onChange(files) {
        const { onChange, imageOptions } = this.props;

        const { maxWidth, maxHeigth, quality } = imageOptions || {};

        const postProcessFiles = files.map((file) =>
            imageOptions && isImageType(file.type)
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
        onChange && onChange({ value, originalFiles: files, target: { value, name: this.props.name } });
    }

    @bind
    async handleDropAccepted(files) {
        if (this.props.showPreviews) {
            if (this.state.files.length + files.length > this.props.filesLimit) {
                return this.setState({
                    openSnackbar: true,
                    snackbarMessage: `Maximum allowed number of files exceeded. Only ${this.props.filesLimit} allowed`,
                    snackbarVariant: 'error',
                });
            }

            this.setState({ files: this.state.files.concat(files) }, () => {
                this.onChange(files);
                let message = '';
                files.forEach((file) => {
                    message += `File ${file.name} successfully added.`;
                });
                this.props.showAlerts &&
                    this.setState({
                        openSnackbar: true,
                        snackbarMessage: message,
                        snackbarVariant: 'success',
                    });
            });
        } else {
            this.onChange(files);
        }
        this.props.onDropAccepted && this.props.onDropAccepted(files);
    }

    @bind
    handleRemove(index) {
        return (event) => {
            event.stopPropagation();
            const { files } = this.state;
            const fileName = get(files, `[${index}].name`);
            files.splice(index, 1);
            this.setState({ files }, () => {
                this.onChange(files);
                this.props.showAlerts &&
                    this.setState({
                        openSnackbar: true,
                        snackbarMessage: 'File ' + fileName + ' removed',
                        snackbarVariant: 'info',
                    });
            });
        };
    }

    @bind
    handleDropRejected(rejectedFiles, evt) {
        let message = '';
        rejectedFiles.forEach((rejectedFile) => {
            message = `File ${rejectedFile.name} was rejected. `;
            if (this.props.acceptedFiles && !this.props.acceptedFiles.includes(rejectedFile.type)) {
                message += 'File type not supported. ';
            }
            if (rejectedFile.size > Number(this.props.fileSizeLimit)) {
                message += `File is too big. Size limit is ${simplifySize(this.props.fileSizeLimit)}. `;
            }
        });
        if (this.props.onDropRejected) {
            this.props.onDropRejected(rejectedFiles, evt);
        }
        this.props.showAlerts &&
            this.setState({
                openSnackbar: true,
                snackbarMessage: message,
                snackbarVariant: 'error',
            });
    }

    @bind
    onCloseSnackbar() {
        this.setState({
            openSnackbar: false,
        });
    }

    @bind
    @memoize()
    buildFilesList({ files }) {
        return files.map((file, index) => (
            <ListItem key={index}>
                {isImageType(files[index].type) ? (
                    <Avatar src={URL.createObjectURL(file)} />
                ) : (
                    <Avatar>
                        <AttachFileIcon />
                    </Avatar>
                )}
                <ListItemText primary={files[index].name} secondary={files[index].type} />
                <ListItemSecondaryAction>
                    <IconButton onClick={this.handleRemove(index)} aria-label="Delete">
                        <CancelIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ));
    }

    render() {
        const {
            classes,
            capture,
            showPreviews,
            dropzoneText,
            dropzoneTextHover,
            multiple,
            children,
            dropZoneClasses,
            onClick,
            ...restProps
        } = this.props; // eslint-disable-line max-len
        const { files } = this.state;
        return (
            <Fragment>
                <ReactDropzone {...restProps} onDropAccepted={this.handleDropAccepted} onDropRejected={this.handleDropRejected}>
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return !children ? (
                            <div
                                {...getRootProps()}
                                className={`${classes.dropZone} ${isDragActive && classes.dropZoneActive} ${dropZoneClasses}`}
                            >
                                <input {...getInputProps()} capture={capture} multiple={multiple} />
                                <CloudUploadIcon className={classes.dropzoneIcon} />
                                {isDragActive ? (
                                    <Typography className={classes.dropzoneTypography}>{dropzoneTextHover}</Typography>
                                ) : (
                                    <Typography className={classes.dropzoneTypography}>{dropzoneText}</Typography>
                                )}
                            </div>
                        ) : (
                            <div
                                {...getRootProps({
                                    onClick,
                                })}
                                className={`${classes.relative} ${dropZoneClasses || ''} ${isDragActive && classes.dropZoneActive}`}
                            >
                                {isDragActive && (
                                    <div className={classes.dropzoneBounceIcon}>
                                        <MdiIcon color="secondary" name="arrow-down-thick" size={80} />
                                        <Typography className={classes.dropzoneTypography}>{dropzoneTextHover}</Typography>
                                    </div>
                                )}
                                <input {...getInputProps()} capture={capture} multiple={multiple} />
                                {children}
                            </div>
                        );
                    }}
                </ReactDropzone>
                {showPreviews && <List>{this.buildFilesList({ files })}</List>}
                {this.props.showAlerts && (
                    <DropzoneSnackBar
                        open={this.state.openSnackbar}
                        autoHideDuration={6000}
                        onClose={this.onCloseSnackbar}
                        variant={this.state.snackbarVariant}
                        message={this.state.snackbarMessage}
                    />
                )}
            </Fragment>
        );
    }
}

export default withStyles(styles)(Dropzone);
