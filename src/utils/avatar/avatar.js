import memoize from 'memoize-one';

export const generateColor = memoize((colors, name) => {
    if (name && name[0]) {
        const sum = name.split('').reduce((accumulator, value) => accumulator + value.charCodeAt(0), 0);
        return colors[sum % colors.length];
    }
    return colors[0];
});

export const createInitials = memoize((name, extraSighn = '_') => {
    const cleanName = (name || '').trim();
    const namesSpace = cleanName.split(' ');
    const namesSlash = cleanName.split(extraSighn);
    const names = namesSpace.length > 1 ? namesSpace : namesSlash;
    if (!names[0].length) {
        return 'NN';
    }
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
});
