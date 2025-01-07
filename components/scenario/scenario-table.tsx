'use client';

import Link from 'next/link';
import { ScenarioDeleteDialog } from '~/components/scenario/scenario-delete-dialog';
import { type Scenario } from '~/lib/domain/scenario';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { PropsWithoutRef } from 'react';
import { Download, PlayIcon } from 'lucide-react';

export const columns: ColumnDef<{ id: number; data: Scenario }>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-right">ID</div>
    },
    {
        accessorKey: 'data'
    },
    {
        accessorKey: 'lat',
        header: () => <div className="text-right">Latitude</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('data') as Scenario;
            return <div className="text-right font-medium">{scenario.view.latitude.toFixed(4)}</div>;
        }
    },
    {
        accessorKey: 'lon',
        header: () => <div className="text-right">Longitude</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('data') as Scenario;
            return <div className="text-right font-medium">{scenario.view.longitude.toFixed(4)}</div>;
        }
    },
    {
        accessorKey: 'zoom',
        header: () => <div className="text-right">Zoom</div>,
        cell: ({ row }) => {
            const scenario = row.getValue('data') as Scenario;

            return <div className="text-right font-medium">{scenario.view.zoom.toFixed(0)}</div>;
        }
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

export const ScenariosTable = (props: PropsWithoutRef<{ scenarios: { id: number; data: Scenario }[] }>) => {
    return <DataTable data={props.scenarios} columns={columns} initialState={{ columnVisibility: { data: false } }} />;
};
