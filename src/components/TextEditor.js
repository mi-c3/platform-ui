import React, { PureComponent } from 'react';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';

import { createEvent } from 'utils/http/event';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import 'styles/react-mde-all.css';

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
});

class TextEditor extends PureComponent {
    static propTypes = {
        ...(ReactMde || {}).propTypes,
    };

    state = {
        selectedTab: 'write',
        value: '',
    };

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
        return (
            <ReactMde
                selectedTab={selectedTab}
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
