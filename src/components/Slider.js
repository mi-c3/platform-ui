import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import MuiSlider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { withStyles } from '@material-ui/styles';
import { colors } from 'styles/theme';

const useStyles = withStyles({
    slider: {
        padding: '1rem 0',
        '& .MuiSlider-track': {
            backgroundColor: ({ fillColor }) => fillColor || colors.primary.dark,
        },
    },
});

class Slider extends PureComponent {
    static propTypes = {
        ...(MuiSlider || {}).propTypes,
        className: PropTypes.string,
        label: PropTypes.string,
        fillColor: PropTypes.string,
        SliderProps: PropTypes.object,
        classes: PropTypes.object,
    };

    @bind
    onChange(event, value) {
        const { name, onChange } = this.props;
        onChange &&
            onChange(
                createEvent('change', {
                    target: { name, value },
                    originalEvent: event,
                }),
                event
            );
    }

    render() {
        const { label, classes, className, TypographyProps, ...restProps } = this.props;
        return (
            <Fragment>
                {label && <Typography {...TypographyProps}>{label}</Typography>}
                <MuiSlider className={`${className} ${classes.slider}`} {...restProps} onChange={this.onChange} />
            </Fragment>
        );
    }
}

export default useStyles(Slider);
