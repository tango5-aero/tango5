'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, CircleX } from 'lucide-react';
import { PropsWithoutRef } from 'react';
import { DataTable } from '~/components/ui/data-table';
import { UserGameDeleteDialog } from '~/components/usergame/usergame-delete-dialog';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';
import { TableContext } from '~/hooks/use-table-context';
import { getCurrentUserGamesPage, getUserGamesPage } from '~/lib/actions';
import { UserGameSelect } from '~/lib/types';
import { formatDuration } from '~/lib/utils';

type UserGamesTableProps = {
    adminAccess: boolean;
};

export const userColumns: ColumnDef<UserGameSelect>[] = [
    {
        accessorKey: 'scenarioId',
        header: () => <div className="text-center">Scenario</div>,
        cell: ({ row }) => <div className="text-center">{`#${row.original.scenarioId}`}</div>
    },
    {
        accessorKey: 'playTime',
        header: () => <div className="text-center">Time (seconds)</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.original.success ? formatDuration(row.original.playTime) : 'N/A'}</div>
        )
    },
    {
        accessorKey: 'success',
        header: () => <div className="text-center">Succeded</div>,
        cell: ({ row }) => (
            <div className="flex justify-center text-center">
                {row.original.success ? <CircleCheck /> : <CircleX />}
            </div>
        )
    }
];

export const adminColumns: ColumnDef<UserGameSelect>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-center">Game</div>
    },
    {
        accessorKey: 'userId',
        header: () => <div className="text-center">User</div>,
        cell: ({ row }) => (
            <div className="max-w-20 overflow-hidden text-ellipsis text-center md:max-w-32 lg:max-w-none lg:overflow-auto">
                {row.original.userId}
            </div>
        )
    },
    ...userColumns,
    {
        accessorKey: 'action',
        header: () => <div className="text-center">Action(s)</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <UserGameDeleteDialog id={row.original.id} />
            </div>
        )
    }
];

export const UserGamesTable = (props: PropsWithoutRef<UserGamesTableProps>) => {
    const { pagination, onPaginationChange, limit, offset } = usePagination();

    const { data, rowCount, loading, forceRefresh } = useTableApi(
        props.adminAccess ? getUserGamesPage : getCurrentUserGamesPage,
        limit,
        offset
    );

    return (
        <TableContext value={{ forceRefresh }}>
            <DataTable
                data={data}
                rowCount={rowCount}
                loading={loading}
                onPaginationChange={onPaginationChange}
                pagination={pagination}
                columns={props.adminAccess ? adminColumns : userColumns}
                initialState={{ columnVisibility: { data: false } }}
            />
        </TableContext>
    );
};
