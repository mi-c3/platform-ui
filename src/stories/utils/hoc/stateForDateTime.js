
import React, { PureComponent } from 'react';

class StateForDateTime extends PureComponent {

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
        const { Com, ...rest } = this.props;
        return <Com {...rest} value={this.state.value} onChange={this.onChange} />;
    }
}

export default (Component) => (props) => <StateForDateTime {...props} Com={Component} />; // eslint-disable-line
