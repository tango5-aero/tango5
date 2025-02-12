'use client';

import Link from 'next/link';
import { ScenarioDeleteDialog } from '~/components/scenario/scenario-delete-dialog';
import { type ScenarioData } from '~/lib/domain/scenario';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '~/components/ui/data-table';
import { Download, PlayIcon, EyeIcon } from 'lucide-react';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';
import { getScenariosPage } from '~/lib/actions';
import { TableContext } from '~/hooks/use-table-context';
import { ScenarioUploadDialog } from './scenario-upload-dialog';
import { Flight } from '~/lib/domain/flight';
import { Pcd } from '~/lib/domain/pcd';
import { ScenarioParsed } from '~/lib/types';
import { ScenarioActiveCheckbox } from './scenario-active-checkbox';

export const columns: ColumnDef<ScenarioParsed>[] = [
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
            const flightsDict: Record<string, Flight> = scenarioData.flights.reduce(
                (acc: Record<string, Flight>, flight) => {
                    acc[flight.id] = new Flight(
                        flight.id,
                        flight.latitudeDeg,
                        flight.longitudeDeg,
                        flight.altitudeFt,
                        flight.callsign,
                        flight.groundSpeedKts,
                        flight.trackDeg,
                        flight.verticalSpeedFtpm,
                        flight.selectedAltitudeFt
                    );
                    return acc;
                },
                {}
            );
            const countPcds = scenarioData.pcds.filter(
                (pcd) =>
                    !new Pcd(
                        flightsDict[pcd.firstId],
                        flightsDict[pcd.secondId],
                        pcd.minDistanceNM,
                        pcd.timeToMinDistanceMs
                    ).isSafe
            ).length;
            return <div className="text-right font-medium">{countPcds}</div>;
        }
    },
    {
        accessorKey: 'active',
        header: () => <div className="text-right">Active</div>,
        cell: ({ row }) => {
            const active = row.getValue('active') as boolean;
            const id = row.getValue('id') as number;
            return (
                <div className="mr-2 flex justify-end">
                    <ScenarioActiveCheckbox id={id} checked={active} />
                </div>
            );
        }
    },
    {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const id = row.getValue('id') as number;
            const data = row.getValue('data') as ScenarioData;

            return (
                <div className="flex flex-row justify-end gap-2">
                    <Link href={`/backstage/play/${id}`}>
                        <PlayIcon size={'1rem'} />
                    </Link>
                    <Link href={`/backstage/play/${id}?solution=true`}>
                        <EyeIcon size={'1rem'} />
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
    const { data, rowCount, loading, forceRefresh } = useTableApi(getScenariosPage, limit, offset);

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
            <ScenarioUploadDialog />
        </TableContext>
    );
};
