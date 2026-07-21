import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DataTableHead from 'components/Table/DataTableHead';
import DataTableToolbar from 'components/Table/DataTableToolbar';
import { get } from 'utils/lo/lo';
import { getSorting, stableSort } from 'utils/table/table';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

const StyledPaper = styled(Paper)`
    width: 100%;
    margin-top: 24px;
    max-height: inherit;
`;

const StyledTable = styled(Table)`
    min-width: 1020px;
`;

const TableWrapper = styled.div`
    overflow-x: auto;
`;

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
        const pageSize = get(props, 'gridSettings.pageSize') || 10;
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
    getRowKey(row) {
        const { dataKey } = this.props;
        return dataKey ? row[dataKey] : row.id;
    }

    @bind
    handleSelectAllClick(event) {
        const { data } = this.props;
        const selected = event.target.checked ? data.map(this.getRowKey) : [];
        this.setState({ selected }, () => this.props.onSelectionChange(selected));
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
                const rowKey = this.getRowKey(row);
                const isSelected = this.isSelected(rowKey);
                return (
                    <TableRow hover onClick={this.select(rowKey)} tabIndex={-1} key={rowKey} selected={isSelected}>
                        {columnDefinitions.map(({ field, renderValue }, index) => (
                            <TableCell key={index}>{renderValue ? renderValue({ value: row[field] }) : row[field]}</TableCell>
                        ))}
                    </TableRow>
                );
            });
    }

    render() {
        const { columnDefinitions, dataKey, data, title, selectionMode } = this.props;
        const { order, orderBy, selected, pageSize, page } = this.state;
        const emptyRows = pageSize - Math.min(pageSize, data.length - page * pageSize);
        return (
            <StyledPaper>
                <DataTableToolbar
                    numSelected={selected.length}
                    rowCount={data.length}
                    onSelectAllClick={this.handleSelectAllClick}
                    selectionMode={selectionMode}
                    title={title}
                />
                <TableWrapper>
                    <StyledTable aria-labelledby="tableTitle">
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
                    </StyledTable>
                </TableWrapper>
                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onPageChange={this.handleChangePage}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={this.handleChangePageSize}
                />
            </StyledPaper>
        );
    }
}

export default DataTable;
