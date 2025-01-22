import { type Meta } from '@storybook/react';
import { MaterialReactTable, type MRT_ColumnDef } from '../../src';
import { faker } from '@faker-js/faker';
import { type Person, createPersonData } from '../static-data';

const meta: Meta = {
  title: 'Features/Column Actions Hover',
  parameters: {
    status: {
      type: 'stable',
    },
  },
};

export default meta;

const columns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
];

const data = createPersonData(20);

export const ColumnActionsHoverEnabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    show_column_actions_on_hover={true}
    initialState={{ density: 'comfortable' }}
  />
);

export const ColumnActionsHoverDisabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    show_column_actions_on_hover={false}
    initialState={{ density: 'comfortable' }}
  />
);

export const ColumnActionsHoverWithSorting = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    show_column_actions_on_hover={true}
    enableSorting={true}
    initialState={{
      density: 'comfortable',
      sorting: [{ id: 'firstName', desc: false }],
    }}
  />
);

export const ColumnActionsHoverWithFiltering = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    show_column_actions_on_hover={true}
    enableColumnFilters={true}
    initialState={{
      density: 'comfortable',
      showColumnFilters: true,
    }}
  />
);
