import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu, { type MenuProps } from '@mui/material/Menu';
import TextField from '@mui/material/TextField';
import { MRT_ShowHideColumnsMenuItems } from './MRT_ShowHideColumnsMenuItems';
import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';

export interface MRT_ShowHideColumnsMenuProps<TData extends MRT_RowData>
  extends Partial<MenuProps> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsMenu = <TData extends MRT_RowData>({
  anchorEl,
  setAnchorEl,
  table,
  ...rest
}: MRT_ShowHideColumnsMenuProps<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      enable_column_search_in_show_hide_menu,
      localization,
      mrtTheme: { menuBackgroundColor },
    },
  } = table;
  const { columnOrder, columnPinning, density } = getState();
  const [search_value, set_search_value] = useState('');

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value));
  };

  const allColumns = useMemo(() => {
    const columns = getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as MRT_Column<TData>[];

  const filtered_columns = useMemo(() => {
    if (!search_value) return allColumns;
    return allColumns.filter((col) =>
      col.columnDef.header
        ?.toString()
        .toLowerCase()
        .includes(search_value.toLowerCase()),
    );
  }, [allColumns, search_value]);

  const isNestedColumns = allColumns.some(
    (col) => col.columnDef.columnDefType === 'group',
  );

  const hasColumnOrderChanged = useMemo(
    () =>
      columnOrder.length !== initialState.columnOrder.length ||
      !columnOrder.every(
        (column, index) => column === initialState.columnOrder[index],
      ),
    [columnOrder, initialState.columnOrder],
  );

  const [hoveredColumn, setHoveredColumn] = useState<MRT_Column<TData> | null>(
    null,
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    set_search_value(event.target.value);
  };

  return (
    <Menu
      MenuListProps={{
        dense: density === 'compact',
        sx: {
          backgroundColor: menuBackgroundColor,
          minWidth: '220px',
          maxHeight: '400px',
        },
        onKeyDown: (e) => {
          // Prevent menu keyboard navigation when searching
          if (enable_column_search_in_show_hide_menu) {
            e.stopPropagation();
          }
        },
      }}
      anchorEl={anchorEl}
      disableScrollLock
      onClose={() => {
        setAnchorEl(null);
        set_search_value('');
      }}
      open={!!anchorEl}
      {...rest}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: '0.5rem',
          pt: 0,
        }}
      >
        {enableHiding && (
          <Button
            disabled={!getIsSomeColumnsVisible()}
            onClick={() => handleToggleAllColumns(false)}
          >
            {localization.hideAll}
          </Button>
        )}
        {enableColumnOrdering && (
          <Button
            onClick={() =>
              table.setColumnOrder(
                getDefaultColumnOrderIds(table.options, true),
              )
            }
            disabled={!hasColumnOrderChanged}
          >
            {localization.resetOrder}
          </Button>
        )}
        {enableColumnPinning && (
          <Button
            disabled={!getIsSomeColumnsPinned()}
            onClick={() => table.resetColumnPinning(true)}
          >
            {localization.unpinAll}
          </Button>
        )}
        {enableHiding && (
          <Button
            disabled={getIsAllColumnsVisible()}
            onClick={() => handleToggleAllColumns(true)}
          >
            {localization.showAll}
          </Button>
        )}
      </Box>
      {enable_column_search_in_show_hide_menu && (
        <>
          <Divider />
          <Box
            sx={{
              p: '0.5rem',
              position: 'sticky',
              top: 0,
              backgroundColor: menuBackgroundColor,
              zIndex: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder={localization.search}
              size="small"
              value={search_value}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              autoFocus
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'background.paper',
                },
              }}
            />
          </Box>
        </>
      )}
      <Divider />
      <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
        {filtered_columns.map((column, index) => (
          <MRT_ShowHideColumnsMenuItems
            allColumns={allColumns}
            column={column}
            hoveredColumn={hoveredColumn}
            isNestedColumns={isNestedColumns}
            key={`${index}-${column.id}`}
            setHoveredColumn={setHoveredColumn}
            table={table}
          />
        ))}
      </Box>
    </Menu>
  );
};
