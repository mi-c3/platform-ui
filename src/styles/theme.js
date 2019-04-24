
import blueGrey from '@material-ui/core/colors/blueGrey';
import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
    primary: {
        light: '#1EA8CF',
        dark: '#4BB9D9',
        main: '#4BB9D9',
    },
    secondary: blueGrey,
    common: {
        white: '#ffffff',
        black: '#000000',
    },
    darkGray: '#DADADA',
    darkBlue: '#066AB1',
    background: '#242E36',
    red: '#C22525',
};

export const DarkTheme = createMuiTheme({
    colors,
    palette: {
        type: 'dark',
        action: {
            disabled: colors.background,
            disabledBackground: colors.background,
            hover: colors.background,
            hoverOpacity: 0.1,
            selected: colors.background,
        },
        primary: {
            ...colors.primary,
        },
        secondary: {
            ...colors.primary
        },
        background: {
            paper: colors.background,
            default: colors.background,
        },
    },
    typography: { useNextVariants: true },
    overrides: {
        MuiFilledInput: {
            root: {
                backgroundColor: colors.background,
                '&$focused': {
                    backgroundColor: colors.background,
                },
                '&:hover': {
                    backgroundColor: colors.background,
                },
                '&$disabled': {
                    backgroundColor: colors.background,
                },
            },
        },
        MuiCheckbox: {
            colorSecondary: {
                '&$checked': {
                    color: colors.primary.dark,
                },
                '&$disabled': {
                    color: colors.darkGray,
                },
            },
        },
        MuiFormLabel: {
            asterisk: {
                color: colors.red,
            }
        },
        MuiPaper: {
            root: {
                maxHeight: '15rem',
            }
        },
        MuiChip: {
            colorPrimary: {
                color: colors.common.white,
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2))',
                backgroundColor: colors.darkBlue,
            }
        },
        MuiMenuItem: {
            root: {
                '&$selected': {
                    backgroundColor: colors.darkBlue,
                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2))',
                },
                '&:hover': {
                    backgroundColor: colors.darkBlue,
                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2))',
                },
            },
        },
    }
});
