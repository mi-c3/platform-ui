import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class StateForDateTime extends PureComponent {

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
        children: PropTypes.node,
    };

    constructor(props) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (value !== prevProps.value && value !== this.state.value) {
            this.setState({ value });
        }
    }

    onChange = (value) => {
        this.setState({ value });
        this.props.onChange && this.props.onChange(value);
    }

    render() {
        const { Component, children, ...rest } = this.props;
        return <Component {...rest} value={this.state.value} onChange={this.onChange}>{children}</Component>;
    }
}

export default (Component) => (props) => <StateForDateTime {...props} Component={Component} />; // eslint-disable-line
