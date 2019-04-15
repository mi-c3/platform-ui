import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@material-ui/core/Link';

const LinkWithRouter = (props) => <MuiLink {...props} component={RouterLink} />;

const Link = (props: Object) => {
    const { to } = props;
    const LinkComponent = to ? LinkWithRouter : MuiLink;
    return <LinkComponent {...props} />;
};

export default Link;
