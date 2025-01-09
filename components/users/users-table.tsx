'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { PropsWithoutRef } from 'react';

export const columns: ColumnDef<{ id: string }>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-center">id</div>
    },
    {
        accessorKey: 'firstName',
        header: () => <div className="text-left">First Name</div>
    },
    {
        accessorKey: 'lastName',
        header: () => <div className="text-left">Last Name</div>
    }
];

export const UsersTable = (props: PropsWithoutRef<{ users: { id: string }[] }>) => {
    return <DataTable data={props.users} columns={columns} initialState={{ columnVisibility: { data: false } }} />;
};
