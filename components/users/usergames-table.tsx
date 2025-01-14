'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { PropsWithoutRef } from 'react';

export type UserGameRow = {
    scenarioId: number;
    playTime: string;
    success: boolean;
};

export const columns: ColumnDef<UserGameRow>[] = [
    {
        accessorKey: 'scenarioId',
        header: () => <div className="text-center">Scenario ID</div>
    },
    {
        accessorKey: 'playTime',
        header: () => <div className="text-center">Play Time</div>
    },
    {
        accessorKey: 'success',
        header: () => <div className="text-center">Succeded?</div>,
        cell: ({ row }) => <div className="text-center">{row.original.success ? '✅' : '❌'}</div>
    }
];

export const UserGamesTable = (props: PropsWithoutRef<{ usergames: UserGameRow[] }>) => {
    return <DataTable data={props.usergames} columns={columns} initialState={{ columnVisibility: { data: false } }} />;
};
