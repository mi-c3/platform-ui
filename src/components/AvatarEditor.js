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
    avatarEditor: {
        borderRadius: '100rem',
    },
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

const styleColor = [255, 255, 255, 1];
const defaultState = {
    showAvatarEditor: false,
    imageFile: null,
    scale: 1,
    rotate: 0,
};

class AvatarEditor extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        label: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        withEditButton: PropTypes.bool,
        image: PropTypes.string,
        initials: PropTypes.string,
        classes: PropTypes.object,
        AvatarProps: PropTypes.object,
        ReactAvatarEditorProps: PropTypes.object,
        AvatarGridProps: PropTypes.object,
        GridProps: PropTypes.object,
        EditButtonProps: PropTypes.object,
    };

    static defaultProps = {
        AvatarProps: {},
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
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (canvas) {
                canvas.toBlob(
                    (blob) => {
                        const image = new File([blob], `${name || 'profile'}.jpg`, { type: 'image/jpeg' });
                        this.setState(defaultState, () => {
                            if (onChange) {
                                onChange(createEvent('change', { target: { value: image, name } }));
                            }
                        });
                    },
                    'image/jpeg',
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
        const { image, classes, initials, label, disabled, AvatarProps, ReactAvatarEditorProps, AvatarGridProps, EditButtonProps, GridProps } = this.props; // eslint-disable-line prettier/prettier
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
                            <Avatar initials={initials} src={image} {...AvatarProps} />
                            {label && <Typography className={classes.label}>{label}</Typography>}
                            {EditButtonProps.label ? (
                                <Button className={classes.avatarEditButton} {...EditButtonProps}>
                                    {EditButtonProps.label}
                                </Button>
                            ) : null}
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
                            className={classes.avatarEditor}
                            {...ReactAvatarEditorProps}
                        />
                        <Grid container direction="column" className={classes.wrapper}>
                            <Grid item container alignItems="center">
                                <Typography>Zoom:</Typography>
                                <Slider
                                    max={4}
                                    min={1}
                                    step={0.01}
                                    value={scale}
                                    onInput={this.handleScaleChange}
                                    className={classes.slider}
                                />
                            </Grid>
                            <Grid item container justify="space-between" alignItems="center">
                                <Typography>Rotate:</Typography>
                                <IconButton onClick={this.handleRotateLeft}>
                                    <MdiIcon name="rotate-left" />
                                </IconButton>
                                <IconButton onClick={this.handleRotateRight}>
                                    <MdiIcon name="rotate-right" />
                                </IconButton>
                            </Grid>
                            <Grid container justify="space-between">
                                <Button variant="text" onClick={this.cancelUpload}>
                                    Cancel
                                </Button>
                                <Button variant="text" color="primary" onClick={this.handleUpload}>
                                    Crop and Upload
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
