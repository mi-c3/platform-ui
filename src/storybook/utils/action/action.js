import { action } from '@storybook/addon-actions';

export const onChange = ({ target }) => action('onchange')({ target });
