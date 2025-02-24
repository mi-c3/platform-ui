import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMde from 'react-mde';
import { markdown } from 'utils/utils';

import { createEvent } from 'utils/http/event';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import 'styles/react-mde-all.css';

const Editor = styled(ReactMde)`
    ${({ disabled }) =>
// eslint-disable-next-line 
    disabled
        ? `& .mde-header { display: none; }
               & .mde-preview { min-height: 32px !important; }`
        : ''}
    ${({ selectedTab }) =>
        // eslint-disable-next-line 
            selectedTab === 'write'
                ? `& .mde-header .mde-tabs button:first-child { display: none; }`
                : `& .mde-header .mde-tabs button:last-child { display: none; }
               & .mde-header ul { display: none; }`}
`;

class TextEditor extends PureComponent {
    static propTypes = {
        ...(ReactMde || {}).propTypes,
        previewDefault: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: props.previewDefault ? 'preview' : 'write',
            value: props.value || '',
        };
    }

    componentDidUpdate(prevProps) {
        const { value: newValue, previewDefault } = this.props;
        if (newValue !== prevProps.value) {
            this.setState({ value: newValue });
        }
        if (previewDefault !== prevProps.previewDefault) {
            this.setState({ selectedTab: previewDefault ? 'preview' : 'write' });
        }
    }

    @bind
    onChange(value) {
        const { name, onChange } = this.props;
        this.setState(
            { value },
            () =>
                onChange &&
                onChange(
                    createEvent('change', {
                        target: { name, value: value || null },
                    })
                )
        );
    }

    @bind
    setSelectedTab(selectedTab) {
        this.setState({ selectedTab });
    }

    @bind
    @memoize()
    buildMarkDown(text) {
        return Promise.resolve(markdown(text));
    }

    render() {
        const { selectedTab, value } = this.state;
        const { disabled } = this.props;
        const state = disabled ? 'preview' : selectedTab;
        return (
            <Editor
                selectedTab={state}
                onTabChange={this.setSelectedTab}
                generateMarkdownPreview={this.buildMarkDown}
                {...this.props}
                value={value}
                onChange={this.onChange}
            />
        );
    }
}

export default TextEditor;
