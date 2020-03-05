import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Checkbox from '@material-ui/core/Checkbox';

import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = (theme) => {
    let highlight = {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
    };
    if (theme.palette.type === 'light') {
        highlight = {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        };
    }
    return {
        root: {
            paddingRight: 8,
        },
        highlight,
        spacer: {
            flex: '1 1 100%',
        },
        actions: {
            color: theme.palette.text.secondary,
            display: 'flex',
        },
        title: {
            flex: '0 0 auto',
        },
    };
};

const DataTableToolbar = (props) => {
    const { numSelected, classes, onSelectAllClick, rowCount, title, selectionMode } = props;
    return (
        <Toolbar className={`${classes.root} ${numSelected > 0 ? classes.highlight : ''}`}>
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {title}
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {selectionMode === 'multiple' && (
                    <Tooltip title="Select All">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </Tooltip>
                )}
                {numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {numSelected === 0 && (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

DataTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func,
    rowCount: PropTypes.number,
    title: PropTypes.string,
    selectionMode: PropTypes.string,
};

export default withStyles(toolbarStyles)(DataTableToolbar);
