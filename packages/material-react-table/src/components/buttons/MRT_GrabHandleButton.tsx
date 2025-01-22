import { type DragEventHandler } from 'react';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_TableInstance,
  type MRT_RowData,
  type MRT_Column,
} from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_GrabHandleButtonProps<TData extends MRT_RowData>
  extends IconButtonProps {
  onDragEnd: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLButtonElement>) => void;
  table: MRT_TableInstance<TData>;
  column: MRT_Column<TData>;
  is_hovered?: boolean;
}

export const MRT_GrabHandleButton = <TData extends MRT_RowData>({
  onDragEnd,
  onDragStart,
  table,
  column,
  is_hovered,
  ...rest
}: MRT_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
      muiColumnDragHandleProps,
      show_column_actions_on_hover,
    },
  } = table;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiColumnDragHandleProps, { table, column }),
    ...rest,
  };

  return (
    <Tooltip {...getCommonTooltipProps()} title={localization.move}>
      <IconButton
        draggable="true"
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        size="small"
        {...iconButtonProps}
        sx={(theme) => ({
          cursor: 'grab',
          height: '2rem',
          opacity: show_column_actions_on_hover ? (is_hovered ? 1 : 0) : 0.3,
          transition: 'opacity 150ms ease-in-out',
          width: '2rem',
          ...(parseFromValuesOrFunc(iconButtonProps?.sx, theme) as any),
        })}
      >
        <DragHandleIcon />
      </IconButton>
    </Tooltip>
  );
};
