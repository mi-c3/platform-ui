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
import IconButton from '@material-ui/core/IconButton';

import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { isImageType } from 'utils/file/file';
import MdiIcon from 'components/MdiIcon';
import Link from 'components/Link';
import { DarkTheme } from 'styles/theme';
import ConfirmationModal from '../ConfirmationModal';

const styles = () => ({
    dropZone: {
        position: 'relative',
        width: '100%',
        cursor: 'pointer',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
        color: DarkTheme.palette.primary[DarkTheme.palette.type],
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
    fileListItem: {
        '& .MuiListItemText-primary': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: 'calc(100% - 50px)',
            display: 'inherit',
            paddingLeft: 8,
        },
        '& .MuiListItemText-secondary': {
            paddingLeft: 8,
        },
    },
});

class Dropzone extends PureComponent {
    static defaultProps = {
        accept: 'image/*,video/*,application/*,audio/*,text/*',
        filesLimit: 1,
        capture: true,
        showPreviews: false, // By default previews show up under in the dialog and inside in the standalone
        clearOnUnmount: true,
        disableDragActive: false,
        deleteButton: true,
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
        clearOnUnmount: PropTypes.bool,
        onChange: PropTypes.func,
        onDropRejected: PropTypes.func,
        onDelete: PropTypes.func,
        acceptedFiles: PropTypes.arrayOf(PropTypes.string),
        fileSizeLimit: PropTypes.number,
        classes: PropTypes.object,
        multiple: PropTypes.bool,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        filesTemplate: PropTypes.func,
        onRemoveFile: PropTypes.func,
        onMouseDown: PropTypes.func,
        deleteButton: PropTypes.bool,
    };

    state = {
        indexToRemove: null,
    };

    @bind
    async onChange(files) {
        const { onChange } = this.props;
        onChange && onChange({ target: { value: files, name: this.props.name } });
    }

    @bind
    async handleDropAccepted(files) {
        const { filesLimit, value } = this.props;
        let updatedFiles = [...(value || []), ...files];
        if (filesLimit && updatedFiles.length > filesLimit) {
            updatedFiles = updatedFiles.slice(0, filesLimit);
        }
        this.onChange(updatedFiles);
        this.props.onDropAccepted && this.props.onDropAccepted(files);
    }

    @bind
    handleRemove(index) {
        const { onRemoveFile, name } = this.props;
        return (event) => {
            event.stopPropagation();
            const { value } = this.props;
            const files = [...(value || [])];
            const removedFile = files[index];
            files.splice(index, 1);
            this.onChange(files);
            onRemoveFile && onRemoveFile(removedFile, index, files, name);
        };
    }

    @bind
    handleDropRejected(rejectedFiles, evt) {
        if (this.props.onDropRejected) {
            this.props.onDropRejected(rejectedFiles, evt);
        }
    }

    @bind
    @memoize()
    filesTemplate(files, indexToRemove, fileActions, deleteButton, classes, disabled) {
        return (files || []).map((file, index) => (
            <ListItem key={index}>
                {isImageType(files[index].type) ? (
                    <Avatar src={file.src || URL.createObjectURL(file)} />
                ) : (
                    <Avatar>
                        <AttachFileIcon />
                    </Avatar>
                )}
                <ListItemText className={classes.fileListItem} primary={files[index].name} secondary={files[index].type} />
                <ListItemSecondaryAction>
                    {fileActions}
                    {file.src && (
                        <IconButton aria-label="Download">
                            <Link target="_blank" download href={file.src}>
                                <MdiIcon name="download" />
                            </Link>
                        </IconButton>
                    )}
                    {deleteButton && !disabled ? (
                        <IconButton disabled={disabled} onClick={() => this.setState({ indexToRemove: index })} aria-label="Delete">
                            <MdiIcon name="close" />
                        </IconButton>
                    ) : null}
                </ListItemSecondaryAction>
                {indexToRemove === index ? (
                    <ConfirmationModal
                        header="Confirmation"
                        message="Are you sure you want to delete this attachment?"
                        open
                        confirmButtonText="Yes"
                        declineButtonText="No"
                        onClose={() => this.setState({ indexToRemove: null })}
                        onConfirm={this.handleRemove(index)}
                    />
                ) : null}
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
            disableDragActive,
            filesTemplate,
            value,
            onMouseDown,
            ...restProps
        } = this.props; // eslint-disable-line max-len
        const { indexToRemove } = this.state;
        const { fileActions, deleteButton, disabled } = restProps;
        return (
            <Fragment>
                <ReactDropzone {...restProps} onDropAccepted={this.handleDropAccepted} onDropRejected={this.handleDropRejected}>
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return !children ? (
                            <div
                                {...getRootProps()}
                                onMouseDown={onMouseDown}
                                role="button"
                                tabIndex="0"
                                className={`
                                  ${classes.dropZone}
                                  ${!disableDragActive && isDragActive && classes.dropZoneActive}
                                  ${dropZoneClasses}
                                `}
                            >
                                <input {...getInputProps()} capture={capture} multiple={multiple} />
                                <CloudUploadIcon className={classes.dropzoneIcon} />
                                {!disableDragActive && isDragActive ? (
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
                                onMouseDown={onMouseDown}
                                role="button"
                                tabIndex="0"
                                className={`
                                  ${classes.relative}
                                  ${dropZoneClasses || ''}
                                  ${!disableDragActive && isDragActive && classes.dropZoneActive}
                                `}
                            >
                                {!disableDragActive && isDragActive && (
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
                {showPreviews && filesTemplate ? (
                    filesTemplate(value)
                ) : (
                    <List>{this.filesTemplate(value, indexToRemove, fileActions, deleteButton, classes, disabled)}</List>
                )}
            </Fragment>
        );
    }
}

export default withStyles(styles)(Dropzone);
