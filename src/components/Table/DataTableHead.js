import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import { styled } from '@material-ui/styles';
import { bind, memoize } from '../../utils/decorators/decoratorUtils';

const TableCellStyled = styled(TableCell)({
    textTransform: 'capitalize',
    fontSize: '1rem',
});

class DataTableHead extends PureComponent {
    @bind
    createSortHandler(property) {
        return (event) => {
            this.props.onRequestSort(event, property);
        };
    }

    @bind
    buildSortWrapper({ header, field, orderBy, order }) {
        return (
            <Tooltip title="Sort" placement="bottom-start" enterDelay={100}>
                <TableSortLabel active={orderBy === field} direction={order} onClick={this.createSortHandler(field)}>
                    {header || field}
              </TableSortLabel>
          </Tooltip>
        );
    }

    @bind
    @memoize()
    buildRows({ columnDefinitions, orderBy, order }) {
        return columnDefinitions.map(
            ({ field, header, sortable }, index) => (
                <TableCellStyled key={field} index={index} sortDirection={orderBy === field ? order : false}>
                    {sortable === false ? header || field : this.buildSortWrapper({ header, field, orderBy, order })}
              </TableCellStyled>
            ),
            this
        );
    }

    render() {
        const { order, orderBy, columnDefinitions } = this.props;

        return (
            <TableHead>
                <TableRow>{this.buildRows({ columnDefinitions, orderBy, order })}</TableRow>
          </TableHead>
        );
    }
}

DataTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    columnDefinitions: PropTypes.array.isRequired,
};

export default DataTableHead;
