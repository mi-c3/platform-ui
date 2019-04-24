import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import { DarkTheme } from 'styles/theme';

const PuiProvider = ({ children }) => (
    <MuiThemeProvider theme={DarkTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>{children}</MuiPickersUtilsProvider>
    </MuiThemeProvider>
);

PuiProvider.propTypes = {
    children: PropTypes.node,
};

export default PuiProvider;
