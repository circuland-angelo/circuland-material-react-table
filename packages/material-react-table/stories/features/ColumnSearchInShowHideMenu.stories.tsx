import { type Meta } from '@storybook/react';
import { MaterialReactTable, type MRT_ColumnDef } from '../../src';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Column Search In Show Hide Menu',
  parameters: {
    status: {
      type: 'stable',
    },
  },
};

export default meta;

interface Person {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  address: string;
  zip_code: string;
  company: string;
  department: string;
  job_title: string;
  account_status: string;
  last_login: string;
  created_at: string;
  updated_at: string;
  subscription_plan: string;
  payment_method: string;
  billing_cycle: string;
}

const columns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
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
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'zip_code',
    header: 'ZIP Code',
  },
  {
    accessorKey: 'company',
    header: 'Company',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'job_title',
    header: 'Job Title',
  },
  {
    accessorKey: 'account_status',
    header: 'Account Status',
  },
  {
    accessorKey: 'last_login',
    header: 'Last Login',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
  {
    accessorKey: 'subscription_plan',
    header: 'Subscription Plan',
  },
  {
    accessorKey: 'payment_method',
    header: 'Payment Method',
  },
  {
    accessorKey: 'billing_cycle',
    header: 'Billing Cycle',
  },
];

const data = [...Array(100)].map(() => ({
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  city: faker.location.city(),
  state: faker.location.state(),
  country: faker.location.country(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  zip_code: faker.location.zipCode(),
  company: faker.company.name(),
  department: faker.commerce.department(),
  job_title: faker.person.jobTitle(),
  account_status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']),
  last_login: faker.date.recent().toISOString(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  subscription_plan: faker.helpers.arrayElement([
    'Free',
    'Basic',
    'Premium',
    'Enterprise',
  ]),
  payment_method: faker.helpers.arrayElement([
    'Credit Card',
    'PayPal',
    'Bank Transfer',
  ]),
  billing_cycle: faker.helpers.arrayElement(['Monthly', 'Quarterly', 'Yearly']),
}));

export const ColumnSearchEnabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enable_column_search_in_show_hide_menu={true}
    initialState={{ density: 'comfortable' }}
  />
);

export const ColumnSearchDisabled = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enable_column_search_in_show_hide_menu={false}
    initialState={{ density: 'comfortable' }}
  />
);

export const ColumnSearchWithInitiallyHiddenColumns = () => (
  <MaterialReactTable
    columns={columns}
    data={data}
    enable_column_search_in_show_hide_menu={true}
    initialState={{
      density: 'comfortable',
      columnVisibility: {
        phone: false,
        address: false,
        zip_code: false,
        company: false,
        department: false,
        job_title: false,
        account_status: false,
        last_login: false,
        created_at: false,
        updated_at: false,
        subscription_plan: false,
        payment_method: false,
        billing_cycle: false,
      },
    }}
  />
);
