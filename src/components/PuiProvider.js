import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';

import { DarkTheme } from 'styles/theme';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: true,
});
const jss = create({
    ...jssPreset(),
    insertionPoint: document.getElementById('jss-insertion-point'),
});
const PuiProvider = ({ children }) => (
    <MuiThemeProvider theme={DarkTheme}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
            <MuiPickersUtilsProvider utils={MomentUtils}>{children}</MuiPickersUtilsProvider>
        </JssProvider>
    </MuiThemeProvider>
);

PuiProvider.propTypes = {
    children: PropTypes.node,
};

export default PuiProvider;
