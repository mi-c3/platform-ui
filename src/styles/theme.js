import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

export const colors = {
    primary: {
        light: '#1EA8CF',
        dark: '#4BB9D9',
        main: '#4BB9D9',
        contrastText: '#FFFFFF',
    },
    secondary: {
        light: '#FFFFFF',
        dark: '#FFFFFF',
        main: '#FFFFFF',
        contrastText: '#000000',
    },
    common: {
        white: '#ffffff',
        black: '#000000',
    },
    priorityColors: {
        danger: '#C22525',
        warning: '#E65100',
        alert: '#FFA100',
        info: '#88B342',
        success: '#12A98B',
        disabled: '#808080',
    },
    darkGray: '#DADADA',
    darkBlue: '#066AB1',
    background: '#1c263b',
    red: '#C22525',
};

export const DarkTheme = responsiveFontSizes(
    createMuiTheme({
        colors,
        spacing: (factor) => `${0.25 * factor}rem`,
        palette: {
            type: 'dark',
            primary: colors.primary,
            secondary: colors.secondary,
            background: {
                paper: colors.background,
                default: colors.background,
                fields: 'rgba(255, 255, 255, 0.06)',
            },
            action: {
                disabled: colors.background,
                disabledBackground: colors.background,
                hover: `${colors.background}50`,
                hoverOpacity: 0.1,
                selected: colors.background,
            },
        },
        typography: { useNextVariants: true },
        overrides: {
            MuiButton: {
                root: {
                    fontSize: 14,
                },
                containedPrimary: {
                    color: colors.common.white,
                },
                containedSecondary: {
                    color: 'rgba(0, 0, 0, 0.6)',
                },
                contained: {
                    '&$disabled': {
                        backgroundColor: 'rgba(255, 255, 255, 0.24)',
                        color: 'rgba(255, 255, 255, 0.38)',
                    },
                },
                outlined: {
                    '&$disabled': {
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        color: 'rgba(255, 255, 255, 0.38)',
                    },
                },
            },
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
                        backgroundColor: 'transparent',
                    },
                },
                underline: {
                    '&$disabled:before': {
                        borderBottom: 0,
                    },
                },
            },
            MuiRadio: {
                colorPrimary: {
                    '&$disabled': {
                        color: 'rgba(255, 255, 255, 0.38)',
                    },
                },
                colorSecondary: {
                    '&$disabled': {
                        color: 'rgba(255, 255, 255, 0.38)',
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
                colorPrimary: {
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
                },
            },
            MuiChip: {
                colorPrimary: {
                    color: colors.common.white,
                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2))',
                    backgroundColor: colors.darkBlue,
                },
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
        },
    })
);
