/* @flow */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@material-ui/core/Link';


const Link = (props: Object) => {
    const { to } = props;
    const LinkComponent = to ? <MuiLink component={RouterLink} /> : MuiLink;
    return <LinkComponent {...props} />;
};

export default Link;
