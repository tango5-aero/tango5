'use client';

import Link from 'next/link';
import { ScenarioDeleteDialog } from '~/components/scenario/scenario-delete-dialog';
import { type Scenario } from '~/lib/domain/scenario';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { Download, PlayIcon } from 'lucide-react';
import { getScenariosPage } from '~/lib/db/queries';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';

export const columns: ColumnDef<{ id: number; data: Scenario }>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-right">ID</div>
    },
    {
        accessorKey: 'data'
    },
    {
        accessorKey: 'flights',
        header: () => <div className="text-right">Flights</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('data') as Scenario;

            return <div className="text-right font-medium">{scenario.flights.length}</div>;
        }
    },
    {
        accessorKey: 'pcds',
        header: () => <div className="text-right">PCDs</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('data') as Scenario;
            return <div className="text-right font-medium">{scenario.pcds.length}</div>;
        }
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const id = row.getValue('id') as number;
            const data = row.getValue('data') as Scenario;

            return (
                <div className="flex flex-row gap-2">
                    <Link href={`/play/${id}`}>
                        <PlayIcon size={'1rem'} />
                    </Link>
                    <a
                        title={`Download scenario #${id}`}
                        href={`data:application/json,${JSON.stringify(data)}`}
                        download={`t5_scenario_${id}.json`}>
                        <Download size={'1rem'} />
                    </a>
                    <ScenarioDeleteDialog id={id} />
                </div>
            );
        }
    }
];

export const ScenariosTable = () => {
    const { pagination, onPaginationChange, limit, offset } = usePagination();

    const { data, rowCount, loading } = useTableApi(getScenariosPage, limit, offset);

    return (
        <DataTable
            data={data as { id: number; data: Scenario }[]}
            rowCount={rowCount}
            loading={loading}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
            columns={columns}
            initialState={{ columnVisibility: { data: false } }}
        />
    );
};
