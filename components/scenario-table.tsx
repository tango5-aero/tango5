'use client';

import Link from 'next/link';
import { ScenarioDeleteDialog } from '~/components/scenario-delete-dialog';
import { type Scenario, scenarioSchema } from '~/lib/domain/scenario';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './ui/data-table';
import { PropsWithoutRef } from 'react';
import { PlayIcon } from 'lucide-react';
import type { Scenario as DBScenario } from '~/lib/db/schema';

export const columns: ColumnDef<{ id: number; scenario: Scenario }>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-right">ID</div>
    },
    {
        accessorKey: 'scenario',
        header: () => <div className="text-right">Scenario</div>
    },
    {
        accessorKey: 'lat',
        header: () => <div className="text-right">Lat</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('scenario') as Scenario;
            return <div className="text-right font-medium">{scenario.view.latitude}</div>;
        }
    },
    {
        accessorKey: 'lon',
        header: () => <div className="text-right">Lon</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('scenario') as Scenario;
            return <div className="text-right font-medium">{scenario.view.longitude}</div>;
        }
    },
    {
        accessorKey: 'zoom',
        header: () => <div className="text-right">Zoom</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('scenario') as Scenario;

            return <div className="text-right font-medium">{scenario.view.zoom}</div>;
        }
    },
    {
        accessorKey: 'flights',
        header: () => <div className="text-right">Flights</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('scenario') as Scenario;

            return <div className="text-right font-medium">{scenario.flights.length}</div>;
        }
    },
    {
        accessorKey: 'pcds',
        header: () => <div className="text-right">PCDs</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('scenario') as Scenario;
            return <div className="text-right font-medium">{scenario.pcds.length}</div>;
        }
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const id = row.getValue('id') as number;

            return (
                <div className="flex flex-row gap-2">
                    <Link href={`/play/${id}`}>
                        <PlayIcon size={'1rem'} />
                    </Link>
                    <ScenarioDeleteDialog id={id} />
                </div>
            );
        }
    }
];

export const ScenarioTable = (props: PropsWithoutRef<{ scenarios: DBScenario[] }>) => {
    const scenarios = props.scenarios.map((item) => ({
        id: item.id,
        scenario: scenarioSchema.parse(JSON.parse(item.data ?? ''))
    }));

    return <DataTable data={scenarios} columns={columns} initialState={{ columnVisibility: { scenario: false } }} />;
};
