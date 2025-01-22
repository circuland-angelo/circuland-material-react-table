import { type Meta } from '@storybook/react';
import { MaterialReactTable, type MRT_ColumnDef } from '../../src';
import { faker } from '@faker-js/faker';
import { useEffect, useRef, useState } from 'react';
import {
  type MRT_ColumnFiltersState,
  type MRT_VisibilityState,
  type MRT_SortingState,
  type MRT_ColumnOrderState,
} from '../../src/types';

const meta: Meta = {
  title: 'Circuland/Features Demo',
  parameters: {
    status: {
      type: 'stable',
    },
  },
};

export default meta;

interface CirculandItem {
  id: string;
  item_name: string;
  item_description: string;
  category: string;
  sub_category: string;
  status: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  supplier: string;
  supplier_contact: string;
  last_ordered: string;
  next_order_date: string;
  minimum_stock: number;
  maximum_stock: number;
  reorder_point: number;
  storage_location: string;
  warehouse: string;
  expiry_date: string;
  batch_number: string;
  quality_status: string;
  inspection_date: string;
  inspector: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const columns: MRT_ColumnDef<CirculandItem>[] = [
  {
    accessorKey: 'item_name',
    header: 'Item Name',
  },
  {
    accessorKey: 'item_description',
    header: 'Description',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'sub_category',
    header: 'Sub Category',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'unit_price',
    header: 'Unit Price',
    Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: 'total_value',
    header: 'Total Value',
    Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: 'supplier',
    header: 'Supplier',
  },
  {
    accessorKey: 'supplier_contact',
    header: 'Supplier Contact',
  },
  {
    accessorKey: 'last_ordered',
    header: 'Last Ordered',
  },
  {
    accessorKey: 'next_order_date',
    header: 'Next Order Date',
  },
  {
    accessorKey: 'minimum_stock',
    header: 'Min Stock',
  },
  {
    accessorKey: 'maximum_stock',
    header: 'Max Stock',
  },
  {
    accessorKey: 'reorder_point',
    header: 'Reorder Point',
  },
  {
    accessorKey: 'storage_location',
    header: 'Storage Location',
  },
  {
    accessorKey: 'warehouse',
    header: 'Warehouse',
  },
  {
    accessorKey: 'expiry_date',
    header: 'Expiry Date',
  },
  {
    accessorKey: 'batch_number',
    header: 'Batch Number',
  },
  {
    accessorKey: 'quality_status',
    header: 'Quality Status',
  },
  {
    accessorKey: 'inspection_date',
    header: 'Inspection Date',
  },
  {
    accessorKey: 'inspector',
    header: 'Inspector',
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
];

const data = [...Array(100)].map(() => ({
  id: faker.string.uuid(),
  item_name: faker.commerce.productName(),
  item_description: faker.commerce.productDescription(),
  category: faker.commerce.department(),
  sub_category: faker.commerce.product(),
  status: faker.helpers.arrayElement([
    'In Stock',
    'Low Stock',
    'Out of Stock',
    'Discontinued',
  ]),
  quantity: faker.number.int({ min: 0, max: 1000 }),
  unit_price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
  total_value: faker.number.float({
    min: 1000,
    max: 100000,
    fractionDigits: 2,
  }),
  supplier: faker.company.name(),
  supplier_contact: faker.phone.number(),
  last_ordered: faker.date.past().toISOString(),
  next_order_date: faker.date.future().toISOString(),
  minimum_stock: faker.number.int({ min: 10, max: 100 }),
  maximum_stock: faker.number.int({ min: 100, max: 1000 }),
  reorder_point: faker.number.int({ min: 20, max: 200 }),
  storage_location: `${faker.location.buildingNumber()} - ${faker.location.direction()} Aisle`,
  warehouse: faker.location.city() + ' Warehouse',
  expiry_date: faker.date.future().toISOString(),
  batch_number: faker.string.alphanumeric(8).toUpperCase(),
  quality_status: faker.helpers.arrayElement([
    'Passed',
    'Failed',
    'Pending',
    'N/A',
  ]),
  inspection_date: faker.date.recent().toISOString(),
  inspector: faker.person.fullName(),
  notes: faker.lorem.sentence(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
}));

interface TableState {
  column_visibility: MRT_VisibilityState;
  column_sizing: Record<string, number>;
  sorting: MRT_SortingState;
  column_order: MRT_ColumnOrderState;
}

export const CirculandFeatures = ({ table_id = 'circuland-table-1' }) => {
  const is_first_render = useRef(true);

  // Consolidated state management with proper typing
  const [table_state, set_table_state] = useState<TableState>({
    column_visibility: {},
    column_sizing: {},
    sorting: [],
    column_order: [],
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const stored_state = localStorage.getItem(`table_state_${table_id}`);
    if (stored_state) {
      set_table_state(JSON.parse(stored_state));
    }
    is_first_render.current = false;
  }, [table_id]);

  // Save consolidated state to localStorage when any part changes
  useEffect(() => {
    if (is_first_render.current) return;
    localStorage.setItem(
      `table_state_${table_id}`,
      JSON.stringify(table_state),
    );
  }, [table_state, table_id]);

  // Individual state setters that update the consolidated state
  const handle_column_visibility_change = (
    updater:
      | MRT_VisibilityState
      | ((prev: MRT_VisibilityState) => MRT_VisibilityState),
  ) => {
    const new_value =
      typeof updater === 'function'
        ? updater(table_state.column_visibility)
        : updater;
    set_table_state((prev) => ({ ...prev, column_visibility: new_value }));
  };

  const handle_column_sizing_change = (
    updater:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>),
  ) => {
    const new_value =
      typeof updater === 'function'
        ? updater(table_state.column_sizing)
        : updater;
    set_table_state((prev) => ({ ...prev, column_sizing: new_value }));
  };

  const handle_sorting_change = (
    updater: MRT_SortingState | ((prev: MRT_SortingState) => MRT_SortingState),
  ) => {
    const new_value =
      typeof updater === 'function' ? updater(table_state.sorting) : updater;
    set_table_state((prev) => ({ ...prev, sorting: new_value }));
  };

  const handle_column_order_change = (
    updater:
      | MRT_ColumnOrderState
      | ((prev: MRT_ColumnOrderState) => MRT_ColumnOrderState),
  ) => {
    const new_value =
      typeof updater === 'function'
        ? updater(table_state.column_order)
        : updater;
    set_table_state((prev) => ({ ...prev, column_order: new_value }));
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      show_column_actions_on_hover={true}
      enable_column_search_in_show_hide_menu={true}
      enableColumnResizing
      enableColumnOrdering
      enablePinning
      enableRowSelection
      enableColumnFilters
      enableFilters
      enableDensityToggle
      enableFullScreenToggle
      enableHiding
      enablePagination
      onColumnVisibilityChange={handle_column_visibility_change}
      onColumnSizingChange={handle_column_sizing_change}
      onSortingChange={handle_sorting_change}
      onColumnOrderChange={handle_column_order_change}
      state={{
        columnVisibility: table_state.column_visibility,
        columnSizing: table_state.column_sizing,
        sorting: table_state.sorting,
        columnOrder: table_state.column_order,
      }}
      initialState={{
        density: 'compact',
        pagination: {
          pageSize: 25,
          pageIndex: 0,
        },
      }}
    />
  );
};

export const CirculandFeaturesWithCustomVisibility = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    show_column_actions_on_hover={true}
    enable_column_search_in_show_hide_menu={true}
    enableColumnResizing
    enableColumnOrdering
    enablePinning
    enableRowSelection
    enableColumnFilters
    enableFilters
    enableDensityToggle
    enableFullScreenToggle
    enableHiding
    enablePagination
    initialState={{
      density: 'compact',
      // Show only essential columns initially
      columnVisibility: {
        item_description: false,
        sub_category: false,
        supplier_contact: false,
        last_ordered: false,
        next_order_date: false,
        minimum_stock: false,
        maximum_stock: false,
        reorder_point: false,
        storage_location: false,
        warehouse: false,
        expiry_date: false,
        batch_number: false,
        quality_status: false,
        inspection_date: false,
        inspector: false,
        notes: false,
        created_at: false,
        updated_at: false,
      },
      // Pin important columns
      columnPinning: {
        left: ['item_name', 'category'],
        right: ['status', 'quantity'],
      },
      pagination: {
        pageSize: 25,
        pageIndex: 0,
      },
      sorting: [
        {
          id: 'status',
          desc: false,
        },
      ],
    }}
  />
);
