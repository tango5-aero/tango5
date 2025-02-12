'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, XCircle } from 'lucide-react';
import { DataTable } from '~/components/ui/data-table';
import { UserWipeProgressDialog } from '~/components/user/user-wipe-progress-dialog';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';
import { getUsersPage } from '~/lib/actions/users';
import { TableContext } from '~/hooks/use-table-context';
import { UserSelect } from '~/lib/types';

export const columns: ColumnDef<UserSelect>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-center">id</div>
    },
    {
        accessorKey: 'consent',
        header: () => <div className="text-center">consent</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.consent ? <CircleCheck size={20} /> : <XCircle size={20} />}
            </div>
        )
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const id = row.getValue('id') as string;

            return (
                <div className="flex justify-center">
                    <UserWipeProgressDialog id={id} />
                </div>
            );
        }
    }
];

export const UsersTable = () => {
    const { pagination, onPaginationChange, limit, offset } = usePagination();
    const { data, rowCount, loading, forceRefresh } = useTableApi(getUsersPage, limit, offset);

    return (
        <TableContext value={{ forceRefresh, variant: 'default' }}>
            <DataTable
                data={data}
                rowCount={rowCount}
                loading={loading}
                onPaginationChange={onPaginationChange}
                pagination={pagination}
                columns={columns}
                initialState={{ columnVisibility: { data: false } }}
            />
        </TableContext>
    );
};
