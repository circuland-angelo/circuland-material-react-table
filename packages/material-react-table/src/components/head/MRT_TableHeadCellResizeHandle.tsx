import Box from '@mui/material/Box';
import Divider, { type DividerProps } from '@mui/material/Divider';
import { useRef, useCallback } from 'react';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_TableHeadCellResizeHandleProps<TData extends MRT_RowData>
  extends DividerProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellResizeHandleProps<TData>) => {
  const {
    getState,
    options: { columnResizeDirection, columnResizeMode },
    refs: { tableContainerRef },
    setColumnSizingInfo,
  } = table;
  const { density } = getState();
  const { column } = header;

  // Store scroll position in a ref to access it during cleanup
  const scroll_position_ref = useRef({ top: 0, left: 0 });
  const is_resizing_ref = useRef(false);

  const restore_scroll = useCallback(() => {
    if (tableContainerRef.current && is_resizing_ref.current) {
      tableContainerRef.current.scrollTop = scroll_position_ref.current.top;
      tableContainerRef.current.scrollLeft = scroll_position_ref.current.left;
    }
  }, [tableContainerRef]);

  const cleanup_handler = useCallback(() => {
    is_resizing_ref.current = false;
    requestAnimationFrame(() => {
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop = scroll_position_ref.current.top;
        tableContainerRef.current.scrollLeft = scroll_position_ref.current.left;
      }
    });
  }, [tableContainerRef]);

  const handler = (event: any) => {
    // Store current scroll position before resize
    scroll_position_ref.current = {
      top: tableContainerRef.current?.scrollTop ?? 0,
      left: tableContainerRef.current?.scrollLeft ?? 0,
    };
    is_resizing_ref.current = true;

    // Get the original resize handler
    const original_handler = header.getResizeHandler();

    // Create mousemove handler to maintain scroll during resize
    const handle_mouse_move = () => {
      restore_scroll();
      requestAnimationFrame(restore_scroll);
    };

    // Add cleanup handlers for both mouse and touch events
    const cleanup = () => {
      document.removeEventListener('mouseup', cleanup);
      document.removeEventListener('touchend', cleanup);
      document.removeEventListener('mousemove', handle_mouse_move);
      document.removeEventListener('touchmove', handle_mouse_move);
      cleanup_handler();
    };

    document.addEventListener('mousemove', handle_mouse_move);
    document.addEventListener('touchmove', handle_mouse_move);
    document.addEventListener('mouseup', cleanup, { once: true });
    document.addEventListener('touchend', cleanup, { once: true });

    // Call the original handler
    original_handler(event);
  };

  const mx =
    density === 'compact'
      ? '-8px'
      : density === 'comfortable'
        ? '-16px'
        : '-24px';

  const lr = column.columnDef.columnDefType === 'display' ? '4px' : '0';

  return (
    <Box
      className="Mui-TableHeadCell-ResizeHandle-Wrapper"
      onDoubleClick={() => {
        // Store scroll position before reset
        scroll_position_ref.current = {
          top: tableContainerRef.current?.scrollTop ?? 0,
          left: tableContainerRef.current?.scrollLeft ?? 0,
        };
        is_resizing_ref.current = true;

        setColumnSizingInfo((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();

        // Restore scroll position after reset
        cleanup_handler();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform:
          column.getIsResizing() && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) *
                (getState().columnSizingInfo.deltaOffset ?? 0)
              }px)`
            : undefined,
      }}
      sx={(theme) => ({
        '&:active > hr': {
          backgroundColor: theme.palette.info.main,
          opacity:
            header.subHeaders.length || columnResizeMode === 'onEnd' ? 1 : 0,
        },
        cursor: 'col-resize',
        left: columnResizeDirection === 'rtl' ? lr : undefined,
        ml: columnResizeDirection === 'rtl' ? mx : undefined,
        mr: columnResizeDirection === 'ltr' ? mx : undefined,
        position: 'absolute',
        px: '4px',
        right: columnResizeDirection === 'ltr' ? lr : undefined,
      })}
    >
      <Divider
        className="Mui-TableHeadCell-ResizeHandle-Divider"
        flexItem
        orientation="vertical"
        sx={(theme) => ({
          borderRadius: '2px',
          borderWidth: '2px',
          height: '24px',
          touchAction: 'none',
          transform: 'translateX(4px)',
          transition: column.getIsResizing()
            ? undefined
            : 'all 150ms ease-in-out',
          userSelect: 'none',
          zIndex: 4,
          ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
        })}
      />
    </Box>
  );
};
