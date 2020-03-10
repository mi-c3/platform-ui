import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DataTableHead from './DataTableHead';
import DataTableToolbar from './DataTableToolbar';
import { get } from '../../utils/lo/lo';
import { getSorting, stableSort } from '../../utils/table/table';
import { bind, memoize } from '../../utils/decorators/decoratorUtils';

const styles = () => ({
    root: {
        width: '100%',
        marginTop: '24px',
        maxHeight: 'inherit',
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class DataTable extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        columnDefinitions: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        gridSettings: PropTypes.object,
        dataKey: PropTypes.string,
        selectionMode: PropTypes.string,
        onSelectionChange: PropTypes.func,
    };

    static defaultProps = {
        onSelectionChange: () => {},
    };

    constructor(props) {
        super(props);
        const order = get(props, 'gridSettings.sort[0].order');
        const orderBy = get(props, 'gridSettings.sort[0].field');
        const pageSize = get(props, 'gridSettings.pageSize');
        this.state = {
            order,
            orderBy,
            selected: [],
            page: 0,
            pageSize,
        };
    }

    @bind
    sort(event, field) {
        const { orderBy, order } = this.state;
        this.setState({
            order: orderBy === field && order === 'desc' ? 'asc' : 'desc',
            orderBy: field,
        });
    }

    @bind
    handleSelectAllClick(event) {
        const { data } = this.props;
        this.setState({ selected: event.target.checked ? data.map((n) => n.id) : [] });
    }

    @bind
    select(id) {
        return () => {
            const { selectionMode } = this.props;
            if (!selectionMode) {
                return;
            }

            let selected = [...this.state.selected];
            const selectedIndex = selected.indexOf(id);

            switch (selectionMode) {
                case 'multiple':
                    if (selectedIndex === -1) {
                        selected = [...selected, id];
                    } else {
                        selected.splice(selectedIndex, 1);
                    }
                    break;
                case 'single':
                    selected = selectedIndex === -1 ? [id] : [];
                    break;
                default:
            }
            this.setState({ selected }, () => this.props.onSelectionChange(selected));
        };
    }

    @bind
    handleChangePage(event, page) {
        this.setState({ page });
    }

    @bind
    handleChangePageSize(event) {
        this.setState({ pageSize: event.target.value });
    }

    @bind
    isSelected(id) {
        return this.state.selected.indexOf(id) !== -1;
    }

    @bind
    @memoize()
    buildRowsRenderer({ data, order, orderBy, page, pageSize, columnDefinitions, dataKey }) {
        return stableSort(data, getSorting(order, orderBy))
            .slice(page * pageSize, page * pageSize + pageSize)
            .map((row) => {
                const isSelected = this.isSelected(row[dataKey]);
                return (
                    <TableRow hover onClick={this.select(row[dataKey])} tabIndex={-1} key={row[dataKey]} selected={isSelected}>
                        {columnDefinitions.map(({ field, renderValue }, index) => (
                            <TableCell key={index}>{renderValue ? renderValue({ value: row[field] }) : row[field]}</TableCell>
                        ))}
                    </TableRow>
                );
            });
    }

    render() {
        const { classes, columnDefinitions, dataKey, data, title, selectionMode } = this.props;
        const { order, orderBy, selected, pageSize, page } = this.state;
        const emptyRows = pageSize - Math.min(pageSize, data.length - page * pageSize);
        return (
            <Paper className={classes.root}>
                <DataTableToolbar
                    numSelected={selected.length}
                    rowCount={data.length}
                    onSelectAllClick={this.handleSelectAllClick}
                    selectionMode={selectionMode}
                    title={title}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <DataTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.sort}
                            columnDefinitions={columnDefinitions}
                        />
                        <TableBody>
                            {this.buildRowsRenderer({ data, order, orderBy, page, pageSize, columnDefinitions, dataKey })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.handleChangePage}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[5, 10, 25]}
                    onChangeRowsPerPage={this.handleChangePageSize}
                />
            </Paper>
        );
    }
}

DataTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataTable);
