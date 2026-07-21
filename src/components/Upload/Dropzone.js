import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactDropzone from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Avatar from '@mui/material/Avatar';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton';

import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { isImageType } from 'utils/file/file';
import MdiIcon from 'components/MdiIcon';
import Link from 'components/Link';
import { DarkTheme } from 'styles/theme';
import ConfirmationModal from '../ConfirmationModal';

const DropZoneStyled = styled.div`
    position: relative;
    width: 100%;
    cursor: pointer;
    box-sizing: border-box;
    background-color: ${({ $dragActive }) => ($dragActive ? '#50575b90' : 'rgba(255, 255, 255, 0.06)')};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const RelativeStyled = styled.div`
    position: relative;
    ${({ $dragActive }) => ($dragActive ? 'background-color: #50575b90;' : '')};
`;

const TypographyStyled = styled(Typography)`
    font-size: 1.4rem;
    color: white;
`;

const CloudUploadIconStyled = styled(CloudUploadIcon)`
    width: 101px;
    height: 101px;
    color: ${DarkTheme.palette.primary[DarkTheme.palette.mode]};
`;

const BounceIconWrapperStyled = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #50575bf0;
    flex-direction: column;
    z-index: 99;
`;

const ListItemTextStyled = styled(ListItemText)`
    & .MuiListItemText-primary {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: calc(100% - 50px);
        display: inherit;
        padding-left: 8px;
    }
    & .MuiListItemText-secondary {
        padding-left: 8px;
    }
`;

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
        accept: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
        multiple: PropTypes.bool,
        disableClick: PropTypes.bool,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        filesTemplate: PropTypes.func,
        onRemoveFile: PropTypes.func,
        onMouseDown: PropTypes.func,
        deleteButton: PropTypes.bool,
    };

    state = {
        indexToRemove: null,
    };

    /*
     * react-dropzone v14 expects `accept` as an object mapping MIME types (or extensions)
     * to arrays of extensions; the public prop stays the v9 comma separated string.
     */
    @bind
    @memoize()
    buildAccept(accept) {
        if (!accept) {
            return undefined;
        }
        if (typeof accept !== 'string') {
            return accept;
        }
        return accept
            .split(',')
            .map((type) => type.trim())
            .filter(Boolean)
            .reduce((acc, type) => ({ ...acc, [type]: [] }), {});
    }

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

    /*
     * react-dropzone v14 rejects with FileRejection objects ({ file, errors });
     * unwrap them to keep the v9 contract of passing the plain files.
     */
    @bind
    handleDrop(acceptedFiles, fileRejections, event) {
        const { onDrop } = this.props;
        onDrop && onDrop(acceptedFiles, (fileRejections || []).map(({ file }) => file), event);
    }

    @bind
    handleDropRejected(fileRejections, evt) {
        if (this.props.onDropRejected) {
            this.props.onDropRejected((fileRejections || []).map(({ file }) => file), evt);
        }
    }

    @bind
    buildSrc(file) {
        let src = file.src;
        if (!src) {
            try {
                src = URL.createObjectURL(file);
            } catch (err) {} // eslint-disable-line no-empty
        }
        return src;
    }

    @bind
    @memoize()
    filesTemplate(files, indexToRemove, fileActions, deleteButton, disabled) {
        return (files || []).map((file, index) => {
            const src = this.buildSrc(file);
            return (
                <ListItem key={index}>
                    {isImageType(files[index].type) && src ? (
                        <Avatar src={src} />
                    ) : (
                        <Avatar>
                            <AttachFileIcon />
                        </Avatar>
                    )}
                    <ListItemTextStyled primary={files[index].name} secondary={files[index].type} />
                    <ListItemSecondaryAction>
                        {fileActions}
                        {file.src && (
                            <IconButton aria-label="Download" size="large">
                                <Link target="_blank" download href={file.src}>
                                    <MdiIcon name="download" />
                                </Link>
                            </IconButton>
                        )}
                        {deleteButton && !disabled ? (
                            <IconButton
                                disabled={disabled}
                                onClick={() => this.setState({ indexToRemove: index })}
                                aria-label="Delete"
                                size="large">
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
            );
        });
    }

    render() {
        const {
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
            accept,
            disableClick,
            noClick,
            onDrop,
            ...restProps
        } = this.props; // eslint-disable-line max-len
        const { indexToRemove } = this.state;
        const { fileActions, deleteButton, disabled } = restProps;
        return (
            <Fragment>
                <ReactDropzone
                    {...restProps}
                    accept={this.buildAccept(accept)}
                    noClick={noClick !== undefined ? noClick : !!disableClick}
                    onDrop={onDrop && this.handleDrop}
                    onDropAccepted={this.handleDropAccepted}
                    onDropRejected={this.handleDropRejected}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return !children ? (
                            <DropZoneStyled
                                {...getRootProps()}
                                onMouseDown={onMouseDown}
                                role="button"
                                tabIndex="0"
                                $dragActive={!disableDragActive && isDragActive}
                                className={dropZoneClasses || ''}
                            >
                                <input {...getInputProps()} capture={capture} multiple={multiple} />
                                <CloudUploadIconStyled />
                                {!disableDragActive && isDragActive ? (
                                    <TypographyStyled>{dropzoneTextHover}</TypographyStyled>
                                ) : (
                                    <TypographyStyled>{dropzoneText}</TypographyStyled>
                                )}
                            </DropZoneStyled>
                        ) : (
                            <RelativeStyled
                                {...getRootProps({
                                    onClick,
                                })}
                                onMouseDown={onMouseDown}
                                role="button"
                                tabIndex="0"
                                $dragActive={!disableDragActive && isDragActive}
                                className={dropZoneClasses || ''}
                            >
                                {!disableDragActive && isDragActive && (
                                    <BounceIconWrapperStyled>
                                        <MdiIcon color="secondary" name="arrow-down-thick" size={80} />
                                        <TypographyStyled>{dropzoneTextHover}</TypographyStyled>
                                    </BounceIconWrapperStyled>
                                )}
                                <input {...getInputProps()} capture={capture} multiple={multiple} />
                                {children}
                            </RelativeStyled>
                        );
                    }}
                </ReactDropzone>
                {showPreviews && filesTemplate ? (
                    filesTemplate(value)
                ) : (
                    <List>{this.filesTemplate(value, indexToRemove, fileActions, deleteButton, disabled)}</List>
                )}
            </Fragment>
        );
    }
}

export default Dropzone;
