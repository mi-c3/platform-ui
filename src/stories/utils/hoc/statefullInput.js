
import React, { PureComponent } from 'react';

class StatefullInput extends PureComponent {

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

    onChange = (event) => {
        const { value } = event.target;
        this.setState({ value });
        this.props.onChange && this.props.onChange(event);
    }

    render() {
        const { Com, ...rest } = this.props;
        return <Com {...rest} value={this.state.value} onChange={this.onChange} />;
    }
}

export default (Component) => (props) => <StatefullInput {...props} Com={Component} />; // eslint-disable-line
