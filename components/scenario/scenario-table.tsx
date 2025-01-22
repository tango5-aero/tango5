'use client';

import Link from 'next/link';
import { ScenarioDeleteDialog } from '~/components/scenario/scenario-delete-dialog';
import { type ScenarioData } from '~/lib/domain/scenario';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { PropsWithoutRef } from 'react';
import { Download, PlayIcon } from 'lucide-react';
import { ScenarioPublishAction } from './scenario-publish-action';
import { ScenarioSelect } from '~/lib/db/schema';

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
                    <ScenarioPublishAction id={id} releaseDate={releaseDate} />
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

export const ScenariosTable = (
    props: PropsWithoutRef<{ scenarios: { id: number; data: ScenarioData; releaseDate: string | null }[] }>
) => {
    return <DataTable data={props.scenarios} columns={columns} initialState={{ columnVisibility: { data: false } }} />;
};
