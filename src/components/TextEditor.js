import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';

import { createEvent } from 'utils/http/event';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import 'styles/react-mde-all.css';

let converter = () => {};
if (Showdown.Converter) {
    converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });
}

const Editor = styled(ReactMde)`
    ${({ disabled }) =>
        // eslint-disable-next-line prettier/prettier
        disabled
            ? `& .mde-header { display: none; }
               & .mde-preview { min-height: 32px !important; }`
            : ''}
    ${({ selectedTab }) =>
        // eslint-disable-next-line prettier/prettier
        selectedTab === 'write'
            ? `& .mde-header .mde-tabs button:first-child { display: none; }`
            : `& .mde-header .mde-tabs button:last-child { display: none; }
               & .mde-header ul { display: none; }`}
`;

class TextEditor extends PureComponent {
    static propTypes = {
        ...(ReactMde || {}).propTypes,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'write',
            value: props.value || '',
        };
    }

    componentDidUpdate(prevProps) {
        const { value: newValue } = this.props;
        if (newValue !== prevProps.value) {
            this.setState({ value: newValue });
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
    buildMarkDown(markdown) {
        return Promise.resolve(converter.makeHtml(markdown));
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
