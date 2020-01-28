import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@material-ui/core/Link';
import PropTypes from 'prop-types';

const LinkWithRouter = (props) => <MuiLink {...props} component={RouterLink} />;

const Link = (props) => {
    const { to } = props;
    const LinkComponent = to ? LinkWithRouter : MuiLink;
    return <LinkComponent {...props} />;
};

Link.propTypes = {
    to: PropTypes.string,
};

export default Link;
