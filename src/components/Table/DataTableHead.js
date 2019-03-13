import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import styled from 'components/styled';

const TableCellStyled = styled(TableCell)({
    textTransform: 'capitalize',
    fontSize: '1rem',
});

class DataTableHead extends PureComponent {

  createSortHandler = (property) => event => {
      this.props.onRequestSort(event, property);
  };

  buildSortWrapper = ({ header, field, orderBy, order }) => (
      <Tooltip
          title="Sort"
          placement="bottom-start"
          enterDelay={100}
      >
          <TableSortLabel
              active={orderBy === field}
              direction={order}
              onClick={this.createSortHandler(field)}
          >
              {header || field}
          </TableSortLabel>
      </Tooltip>

  )

  buildRows = memoize(({ columnDefinitions, orderBy, order }) => columnDefinitions.map(
      ({ field, header, sortable }) => (
          <TableCellStyled
              key={field}
              sortDirection={orderBy === field ? order : false}
          >
              {sortable === false ? header || field : this.buildSortWrapper({ header, field, orderBy, order })}
          </TableCellStyled>
      ),
      this,
  ))

  render() {
      const { order, orderBy, columnDefinitions } = this.props;

      return (
          <TableHead>
              <TableRow>
                  {this.buildRows({ columnDefinitions, orderBy, order })}
              </TableRow>
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
