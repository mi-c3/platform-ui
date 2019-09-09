import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { colors } from 'styles/theme';
import { getPriorityColor } from 'utils/priority/priorityUtils';

const generatePriorityColor = (priority, disabled) =>
    disabled ? colors.priorityColors['disabled'] : colors.priorityColors[getPriorityColor(priority)];

const getFillColor = (opacity) => ({ fillColor, priority, disabled }) => {
    if (priority) {
        return opacity > -1 ? `${generatePriorityColor(priority, disabled)}${opacity}` : generatePriorityColor(priority, disabled);
    }
    if (fillColor === 'primary') {
        return opacity > -1 ? `${colors.primary.dark}${opacity}` : colors.primary.dark;
    }
    if (opacity > -1) {
        return `${fillColor}${opacity}`;
    }
    return `${fillColor}`;
};

const styles = () => ({
    wrapper: {
        '& svg': {
            display: 'block',
        },
    },
    circleBackground: {
        stroke: getFillColor(44),
    },
    circleProgress: {
        stroke: getFillColor(),
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
    circleText: {
        fontSize: '0.8rem',
        fill: 'white',
    },
});

const CircularProgressStatic = withStyles(styles)((props) => {
    const { size, foreignObjectContent, classes, className, foreignObjectProps, fillColor, borderWidth, ...restProps } = props; //eslint-disable-line no-unused-vars
    const value = props.value >= 0 && props.value <= 100 ? Math.round(props.value) : 0;
    const radius = (props.size - props.borderWidth) / 2;
    const viewBox = `0 0 ${size} ${size}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * value) / 100;
    const content = foreignObjectContent ? (
        <foreignObject x="6" y="6" width="28" height="28" {...foreignObjectProps}>
            {foreignObjectContent}
        </foreignObject>
    ) : (
        <text className={classes.circleText} x="50%" y="50%" dy=".3em" textAnchor="middle">
            {`${value}%`}
        </text>
    );
    return (
        <div {...restProps} className={`${classes.wrapper} ${className}`}>
            <svg width={props.size} height={props.size} viewBox={viewBox} fill="none">
                <circle
                    className={classes.circleBackground}
                    cx={props.size / 2}
                    cy={props.size / 2}
                    r={radius}
                    strokeWidth={`${props.borderWidth}px`}
                />
                <circle
                    className={classes.circleProgress}
                    cx={props.size / 2}
                    cy={props.size / 2}
                    r={radius}
                    strokeWidth={`${props.borderWidth}px`}
                    transform={`rotate(-90 ${props.size / 2} ${props.size / 2})`}
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                    }}
                />
                {content}
            </svg>
        </div>
    );
});

CircularProgressStatic.defaultProps = {
    size: 38,
    borderWidth: 3,
    value: 0,
    color: 'white',
    foreignObjectProps: {},
};

CircularProgressStatic.propTypes = {
    size: PropTypes.number,
    borderWidth: PropTypes.number,
    value: PropTypes.number,
    color: PropTypes.string,
    foreignObjectContent: PropTypes.object,
};

export default memo(CircularProgressStatic);
