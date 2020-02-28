import React from 'react';
import Layout from '@theme/Layout';
import withBaseUrl from '@docusaurus/withBaseUrl';

function Redirect() {
    try {
        if (window) {
            window.location.replace(`${window.location.origin}${withBaseUrl(window.location.search.substring(1))}`);
        }
    } catch {
        console.log('Window still not defined'); // eslint-disable-line no-console
    }
    return <Layout title={`Redirect to storybook`}>Redirecting...</Layout>;
}

export default Redirect;
