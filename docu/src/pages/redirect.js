import React from 'react';
import Layout from '@theme/Layout';

function Redirect() {
    window.location.replace(`${window.location.origin}${window.location.search.substring(1)}`);
    return <Layout title={`Redirect to storybook`}>Redirecting...</Layout>;
}

export default Redirect;
