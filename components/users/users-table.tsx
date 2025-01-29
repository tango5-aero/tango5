'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { UserWipeProgressDialog } from '../user/user-wipe-progress-dialog';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';
import { getUsersPage } from '~/lib/actions/users';
import { TableContext } from '~/hooks/use-table-context';

export const columns: ColumnDef<{ id: string }>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-center">id</div>
    },
    {
        accessorKey: 'consent',
        header: () => <div className="text-center">consent</div>
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
    const { data, rowCount, loading, forceRefresh } = useTableApi(getUsersPage, limit, offset);

    return (
        <TableContext value={{ forceRefresh }}>
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
