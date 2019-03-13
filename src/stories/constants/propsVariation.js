
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
    }
};

const forRadio = {
    colors: {
        ...colors,
        Default: 'default',
    }
};

const forIconSelect = {
    chipType: {
        Icon: 'icon',
        Letters: 'letters',
    }
};

const forIcon = {
    colors:{
        ...colors,
        Inherit: 'inherit',
        Action: 'action',
        Error: 'error',
        Disabled: 'disabled',

    }
};


export {
    forButton,
    forRadio,
    forIconSelect,
    forIcon,
};
