import React from 'react';
import PropTypes from 'prop-types';
// import { ThemeProvider } from '@material-ui/styles';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// import MomentUtils from '@date-io/moment';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';

import { DarkTheme } from 'styles/theme';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: true,
});

const ThemeProvider = ({ children }) => children;
const PuiProvider = ({ children }) => (
    <ThemeProvider theme={DarkTheme}>
        <JssProvider generateClassName={generateClassName}>{children}</JssProvider>
    </ThemeProvider>
);

PuiProvider.propTypes = {
    children: PropTypes.node,
};

export default PuiProvider;
