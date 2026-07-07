import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { lighten } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';

import { DarkTheme } from 'styles/theme';

const highlightCss =
    DarkTheme.palette.mode === 'light'
        ? css`
              color: ${DarkTheme.palette.secondary.main};
              background-color: ${lighten(DarkTheme.palette.secondary.light, 0.85)};
          `
        : css`
              color: ${DarkTheme.palette.text.primary};
              background-color: ${DarkTheme.palette.secondary.dark};
          `;

const StyledToolbar = styled(Toolbar)`
    padding-right: 8px;
    ${({ $highlight }) => ($highlight ? highlightCss : '')}
`;

const Title = styled.div`
    flex: 0 0 auto;
`;

const Spacer = styled.div`
    flex: 1 1 100%;
`;

const Actions = styled.div`
    color: ${DarkTheme.palette.text.secondary};
    display: flex;
`;

const DataTableToolbar = (props) => {
    const { numSelected, onSelectAllClick, rowCount, title, selectionMode } = props;
    return (
        <StyledToolbar $highlight={numSelected > 0}>
            <Title>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {title}
                    </Typography>
                )}
            </Title>
            <Spacer />
            <Actions>
                {selectionMode === 'multiple' && (
                    <Tooltip title="Select All">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </Tooltip>
                )}
            </Actions>
        </StyledToolbar>
    );
};

DataTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func,
    rowCount: PropTypes.number,
    title: PropTypes.string,
    selectionMode: PropTypes.string,
};

export default DataTableToolbar;
