'use client';

import Link from 'next/link';
import { ScenarioDeleteDialog } from '~/components/scenario/scenario-delete-dialog';
import { type ScenarioData } from '~/lib/domain/scenario';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { Download, PlayIcon } from 'lucide-react';
import { ScenarioSelect } from '~/lib/db/schema';
import { ScenarioReleaseDateDialog } from './scenario-release-date-dialog';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';
import { getScenariosPage } from '~/lib/actions';

type ScenarioType = Omit<ScenarioSelect, 'data'> & { data: ScenarioData };

export const columns: ColumnDef<ScenarioType>[] = [
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
            const scenarioData = row.getValue('data') as ScenarioData;

            return <div className="text-right font-medium">{scenarioData.flights.length}</div>;
        }
    },
    {
        accessorKey: 'pcds',
        header: () => <div className="text-right">PCDs</div>,
        cell: ({ row }) => {
            const scenarioData = row.getValue('data') as ScenarioData;
            return <div className="text-right font-medium">{scenarioData.pcds.length}</div>;
        }
    },
    {
        accessorKey: 'releaseDate',
        header: () => <div className="text-right">Release Date</div>,
        cell: ({ row }) => {
            const releaseDate = row.getValue('releaseDate') as string;
            return <div className="text-center font-medium">{releaseDate ?? '-'}</div>;
        }
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const id = row.getValue('id') as number;
            const releaseDate = row.getValue('releaseDate') as string;
            const data = row.getValue('data') as ScenarioData;

            return (
                <div className="flex flex-row gap-2">
                    <Link href={`/play/${id}`}>
                        <PlayIcon size={'1rem'} />
                    </Link>
                    <ScenarioReleaseDateDialog id={id} releaseDate={releaseDate} />
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
            data={data}
            rowCount={rowCount}
            loading={loading}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
            columns={columns}
            initialState={{ columnVisibility: { data: false } }}
        />
    );
};
