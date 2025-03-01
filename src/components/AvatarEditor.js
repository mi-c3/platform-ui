import React, { PureComponent, Fragment } from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import PropTypes from 'prop-types';
import { Grid, Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { bind } from 'utils/decorators/decoratorUtils';
import { isImageType } from 'utils/file/file';
import { createEvent } from 'utils/http/event';
import Slider from './Slider';
import Avatar from './Avatar';
import Dropzone from './Upload/Dropzone';
import Button from './Button';
import MdiIcon from './MdiIcon';

const styles = () => ({
    avatarWrapper: {
        cursor: 'pointer',
    },
    wrapper: {
        maxWidth: 300,
    },
    slider: {
        margin: '8px 0 0 0',
    },
    label: {
        margin: '0 8px',
    },
    avatarEditButton: {
        margin: '1rem',
    },
});

const styleColor = [0, 0, 0, 0.6];
const defaultState = {
    showAvatarEditor: false,
    imageFile: null,
    scale: 1,
    rotate: 0,
};

class AvatarEditor extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        name: PropTypes.string,
        disabled: PropTypes.bool,
        isButton: PropTypes.bool,
        withEditButton: PropTypes.bool,
        image: PropTypes.string,
        initials: PropTypes.string,
        classes: PropTypes.object,
        AvatarProps: PropTypes.object,
        ReactAvatarEditorProps: PropTypes.object,
        AvatarGridProps: PropTypes.object,
        GridProps: PropTypes.object,
        EditButtonProps: PropTypes.object,
        EditorProps: PropTypes.object,
    };

    static defaultProps = {
        AvatarProps: {},
        EditorProps: {},
        ReactAvatarEditorProps: {},
        AvatarGridProps: {},
        GridProps: {},
        EditButtonProps: {},
        withEditButton: false,
    };

    editorRef = React.createRef();
    state = defaultState;

    @bind
    handleDrop(acceptFiles, rejectFiles) {
        const files = [...acceptFiles, ...rejectFiles].filter((file) => isImageType(file.type));
        const imageFile = files[0];
        if (imageFile) {
            this.setState({
                showAvatarEditor: true,
                imageFile,
            });
        }
    }

    @bind
    cancelUpload() {
        this.setState(defaultState);
    }

    @bind
    handleUpload() {
        if (this.editorRef.current) {
            const { name, onChange } = this.props;
            const canvas = this.editorRef.current.getImage();
            const context = canvas.getContext('2d');
            context.globalCompositeOperation = 'destination-over';
            context.fillStyle = 'rgba(0,0,0,0)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (canvas) {
                canvas.toBlob(
                    (blob) => {
                        const image = new File([blob], `${name || 'profile'}.png`, { type: 'image/png' });
                        this.setState(defaultState, () => {
                            if (onChange) {
                                onChange(createEvent('change', { target: { value: image, name } }));
                            }
                        });
                    },
                    'image/png',
                    1
                );
            }
        }
    }

    @bind
    handleScaleChange(event) {
        const { value } = event.target;
        this.setState({ scale: value > 4 ? 4 : value });
    }

    @bind
    handleRotateLeft() {
        this.setState(({ rotate }) => ({
            rotate: parseFloat(rotate - 90),
        }));
    }

    @bind
    handleRotateRight() {
        this.setState(({ rotate }) => ({
            rotate: parseFloat(rotate + 90),
        }));
    }

    @bind
    dropZoneClick(event) {
        const { disabled } = this.props;
        if (disabled) {
            event.stopPropagation();
        }
    }

    render() {
        const { isButton, image, classes, initials, label, disabled, AvatarProps, EditorProps, ReactAvatarEditorProps, AvatarGridProps, EditButtonProps, GridProps } = this.props; // eslint-disable-line ,max-len
        const { showAvatarEditor, imageFile, scale, rotate } = this.state;
        return (
            <Grid container direction="column" alignItems={showAvatarEditor ? 'center' : 'flex-start'} {...GridProps}>
                {!showAvatarEditor ? (
                    <Dropzone accept="image/*" showPreviews={false} showAlerts={false} onDrop={this.handleDrop} dropzoneTextHover="...">
                        <Grid
                            item
                            container
                            justify="space-between"
                            alignItems="center"
                            {...AvatarGridProps}
                            onClick={this.dropZoneClick}
                            className={`${!disabled ? classes.avatarWrapper : ''} ${AvatarGridProps.className}`}
                        >
                            {isButton ? (
                                <Button
                                    iconName={!EditButtonProps.withoutIcon ? 'upload' : ''}
                                    variant="text"
                                    className={classes.avatarEditButton}
                                    {...EditButtonProps}
                                >
                                    {label}
                                </Button>
                            ) : (
                                <>
                                    <Avatar initials={initials} src={image} {...AvatarProps} />
                                    {label && <Typography className={classes.label}>{label}</Typography>}
                                    {EditButtonProps.label ? (
                                        <Button className={classes.avatarEditButton} {...EditButtonProps}>
                                            {EditButtonProps.label}
                                        </Button>
                                    ) : null}
                                </>
                            )}
                        </Grid>
                    </Dropzone>
                ) : (
                    <Fragment>
                        <ReactAvatarEditor
                            image={imageFile}
                            scale={scale}
                            rotate={rotate}
                            ref={this.editorRef}
                            border={0}
                            color={styleColor}
                            borderRadius={0}
                            {...ReactAvatarEditorProps}
                        />
                        <Grid container direction="column" className={classes.wrapper}>
                            {EditorProps?.disableZoom ? null : (
                                <Grid item container alignItems="center">
                                    <Typography>Zoom:</Typography>
                                    <Slider
                                        max={4}
                                        min={1}
                                        step={0.01}
                                        value={scale}
                                        onChange={this.handleScaleChange}
                                        className={classes.slider}
                                    />
                                </Grid>
                            )}
                            {EditorProps?.diabelRotate ? null : (
                                <Grid item container justify="space-between" alignItems="center">
                                    <Typography>Rotate:</Typography>
                                    <IconButton onClick={this.handleRotateLeft}>
                                        <MdiIcon name="rotate-left" />
                                    </IconButton>
                                    <IconButton onClick={this.handleRotateRight}>
                                        <MdiIcon name="rotate-right" />
                                    </IconButton>
                                </Grid>
                            )}
                            <Grid container justify="space-between">
                                <Button variant="text" onClick={this.cancelUpload}>
                                    {EditorProps?.cancelLabel || 'Cancel'}
                                </Button>
                                <Button variant="text" color="primary" onClick={this.handleUpload}>
                                    {EditorProps?.uploadLabel || 'Crop and Upload'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Fragment>
                )}
            </Grid>
        );
    }
}
export default withStyles(styles)(AvatarEditor);
