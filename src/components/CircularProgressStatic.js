import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getFillColor } from 'utils/styles/stylesUtils';

const fill = (opacity) => ({ $fillColor, $priority, $disabled }) =>
    getFillColor(opacity)({ fillColor: $fillColor, priority: $priority, disabled: $disabled });

const Wrapper = styled.div`
    & svg {
        display: block;
    }
    .CircularProgressStatic-circleBackground {
        stroke: ${fill(44)};
    }
    .CircularProgressStatic-circleProgress {
        stroke: ${fill()};
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .CircularProgressStatic-circleText {
        font-size: 0.8rem;
        fill: white;
    }
`;

const CircularProgressStatic = (props) => {
    const {
        size = 38,
        foreignObjectContent,
        classes, //eslint-disable-line no-unused-vars
        className,
        foreignObjectProps = {},
        fillColor,
        borderWidth = 3,
        value: valueProp = 0,
        ...restProps
    } = props;
    const value = valueProp >= 0 && valueProp <= 100 ? Math.round(valueProp) : 0;
    const radius = (size - borderWidth) / 2;
    const viewBox = `0 0 ${size} ${size}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * value) / 100;
    const content = foreignObjectContent ? (
        <foreignObject x="6" y="6" width="28" height="28" {...foreignObjectProps}>
            {foreignObjectContent}
        </foreignObject>
    ) : (
        <text className="CircularProgressStatic-circleText" x="50%" y="50%" dy=".3em" textAnchor="middle">
            {`${value}%`}
        </text>
    );
    return (
        <Wrapper {...restProps} className={className} $fillColor={fillColor} $priority={props.priority} $disabled={props.disabled}>
            <svg width={size} height={size} viewBox={viewBox} fill="none">
                <circle
                    className="CircularProgressStatic-circleBackground"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={`${borderWidth}px`}
                />
                <circle
                    className="CircularProgressStatic-circleProgress"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={`${borderWidth}px`}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                    }}
                />
                {content}
            </svg>
        </Wrapper>
    );
};

CircularProgressStatic.propTypes = {
    size: PropTypes.number,
    borderWidth: PropTypes.number,
    value: PropTypes.number,
    color: PropTypes.string,
    foreignObjectContent: PropTypes.object,
};

export default memo(CircularProgressStatic);
