import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';

import { DarkTheme } from 'styles/theme';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: true,
});

const PuiProvider = ({ children }) => (
    <MuiThemeProvider theme={DarkTheme}>
        <JssProvider generateClassName={generateClassName}>
            <MuiPickersUtilsProvider utils={MomentUtils}>{children}</MuiPickersUtilsProvider>
        </JssProvider>
    </MuiThemeProvider>
);

PuiProvider.propTypes = {
    children: PropTypes.node,
};

export default PuiProvider;
