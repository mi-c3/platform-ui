import React from 'react';
import Layout from '@theme/Layout';

function Redirect() {
    try {
        if (window) {
            window.location.replace(`${window.location.origin}${window.location.search.substring(1)}`);
        }
    } catch {
        console.log('Window still not defined'); // eslint-disable-line no-console
    }
    return <Layout title={`Redirect to storybook`}>Redirecting...</Layout>;
}

export default Redirect;
