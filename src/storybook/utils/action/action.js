import { action } from '@storybook/addon-actions';

export const onChange = ({ target }) => action('onchange')({ target });

export const onClick = ({ target }) => action('onclick')({ target });
