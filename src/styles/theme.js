import { createTheme, responsiveFontSizes } from '@mui/material/styles';

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
    createTheme({
        colors,
        spacing: (factor) => `${0.25 * factor}rem`,
        palette: {
            mode: 'dark',
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
        components: {
            MuiButton: {
                styleOverrides: {
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
                        '&.Mui-disabled': {
                            backgroundColor: 'rgba(255, 255, 255, 0.24)',
                            color: 'rgba(255, 255, 255, 0.38)',
                        },
                    },
                    outlined: {
                        '&.Mui-disabled': {
                            border: '1px solid rgba(255, 255, 255, 0.24)',
                            color: 'rgba(255, 255, 255, 0.38)',
                        },
                    },
                },
            },
            MuiFilledInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: colors.background,
                        '&.Mui-focused': {
                            backgroundColor: colors.background,
                        },
                        '&:hover': {
                            backgroundColor: colors.background,
                        },
                        '&.Mui-disabled': {
                            backgroundColor: 'transparent',
                        },
                    },
                    underline: {
                        '&.Mui-disabled:before': {
                            borderBottom: 0,
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    colorPrimary: {
                        '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.38)',
                        },
                    },
                    colorSecondary: {
                        '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.38)',
                        },
                    },
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    colorSecondary: {
                        '&.Mui-checked': {
                            color: colors.primary.dark,
                        },
                        '&.Mui-disabled': {
                            color: colors.darkGray,
                        },
                    },
                    colorPrimary: {
                        '&.Mui-checked': {
                            color: colors.primary.dark,
                        },
                        '&.Mui-disabled': {
                            color: colors.darkGray,
                        },
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: {
                        color: colors.red,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    colorPrimary: {
                        color: colors.common.white,
                        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2))',
                        backgroundColor: colors.darkBlue,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
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
        },
    })
);
