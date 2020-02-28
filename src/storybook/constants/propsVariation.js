const colors = {
    Primary: 'primary',
    Secondary: 'secondary',
};

const forButton = {
    colors: {
        ...colors,
        Default: 'default',
        Inherit: 'inherit',
    },
    variants: {
        text: 'text',
        outlined: 'outlined',
        contained: 'contained',
        fab: 'fab',
        extendedFab: 'extendedFab',
    },
    sizes: {
        Small: 'small',
        Medium: 'medium',
        Large: 'large',
    },
};

const forRadio = {
    colors: {
        ...colors,
        Default: 'default',
    },
};

const forIconSelect = {
    chipType: {
        Icon: 'icon',
        Letters: 'letters',
    },
};

const forIcon = {
    colors: {
        ...colors,
        Inherit: 'inherit',
        Action: 'action',
        Error: 'error',
        Disabled: 'disabled',
    },
};

const forTypography = {
    variant: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'caption',
        'button',
        'overline',
        'srOnly',
        'inherit',
        'display4',
        'display3',
        'display2',
        'display1',
        'headline',
        'title',
        'subheading',
    ].reduce((accum, type) => {
        accum[type] = type;
        return accum;
    }, {}),
};

export { forButton, forRadio, forIconSelect, forIcon, forTypography };
