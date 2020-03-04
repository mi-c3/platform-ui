import { getPriorityColor } from '../priority/priorityUtils';
import { colors } from '../../styles/theme';

export const getFillColor = (opacity) => ({ fillColor, priority, disabled }) => {
    if (disabled) {
        return colors.priorityColors.disabled;
    }
    if (priority) {
        return opacity > -1
            ? `${colors.priorityColors[getPriorityColor(priority)]}${opacity}`
            : colors.priorityColors[getPriorityColor(priority)];
    }
    if (fillColor === 'primary' || !fillColor) {
        return opacity > -1 ? `${colors.primary.dark}${opacity}` : colors.primary.dark;
    }
    if (opacity > -1) {
        return `${fillColor}${opacity}`;
    }
    return `${fillColor}`;
};
