'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { UserWipeProgressDialog } from '../user/user-wipe-progress-dialog';
import { getUsersPage } from '~/lib/db/queries';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';

export const columns: ColumnDef<{ id: string }>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-center">id</div>
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const id = row.getValue('id') as string;

            return <UserWipeProgressDialog id={id} />;
        }
    }
];

export const UsersTable = () => {
    const { pagination, onPaginationChange, limit, offset } = usePagination();

    const { data, rowCount, loading } = useTableApi(getUsersPage, limit, offset);

    return (
        <DataTable
            data={data as { id: string }[]}
            rowCount={rowCount}
            loading={loading}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
            columns={columns}
            initialState={{ columnVisibility: { data: false } }}
        />
    );
};
