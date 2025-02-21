'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { PropsWithoutRef, startTransition, useActionState, useEffect, useState } from 'react';
import { DataTable } from '~/components/ui/data-table';
import { UserGameDeleteDialog } from '~/components/usergame/usergame-delete-dialog';
import { usePagination } from '~/hooks/use-pagination';
import { useTableApi } from '~/hooks/use-table-api';
import { TableContext } from '~/hooks/use-table-context';
import { getCurrentUserGamesPage, getScenario, getUserGamesPage } from '~/lib/actions';
import { ScenarioSelect, UserGameSelect } from '~/lib/types';
import { formatDuration } from '~/lib/utils';
import { GameSolutionViewer } from '../game/game-solution-viewer';
import { toast } from 'sonner';

type UserGamesTableProps = {
    adminAccess: boolean;
};

const userColumns: ColumnDef<UserGameSelect>[] = [
    {
        accessorKey: 'scenarioId',
        header: () => <div className="text-center">Scenario</div>,
        cell: ({ row }) => <div className="text-center">{`#${row.original.scenarioId}`}</div>
    },
    {
        accessorKey: 'playTime',
        header: () => <div className="text-center">Seconds</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {row.original.success && row.original.playTime ? formatDuration(row.original.playTime) : 'N/A'}
            </div>
        )
    },
    {
        accessorKey: 'success',
        header: () => <div className="text-center">Success</div>,
        cell: ({ row }) => (
            <div className="flex justify-center text-center">
                {row.original.success ? (
                    <Check className="size-6 rounded-full bg-black p-1 text-white" size={20} />
                ) : (
                    <X className="size-6 rounded-full bg-white p-1 text-black" size={20} />
                )}
            </div>
        )
    }
];

const adminColumns: ColumnDef<UserGameSelect>[] = [
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
    const [showSolution, setShowSolution] = useState(false);
    const [scenario, setScenario] = useState<ScenarioSelect | undefined>(undefined);
    const [solutionScenarioState, getSolutionScenario, isLoadingSolution] = useActionState(getScenario, {
        scenario: undefined,
        error: false
    });
    const { pagination, onPaginationChange, limit, offset } = usePagination();

    const { data, rowCount, loading, forceRefresh } = useTableApi(
        props.adminAccess ? getUserGamesPage : getCurrentUserGamesPage,
        limit,
        offset
    );

    const handleRowClick = (row: Row<UserGameSelect>) => {
        setShowSolution(true);
        startTransition(async () => {
            getSolutionScenario(row.original.scenarioId);
        });
    };

    const handleCloseDialog = () => {
        setShowSolution(false);
        setScenario(undefined);
    };

    useEffect(() => {
        if (solutionScenarioState.error) {
            toast.error(`Failed to get solution from scenario: ${solutionScenarioState.errorMessage}`);
            return;
        }

        setScenario(solutionScenarioState.scenario);
    }, [solutionScenarioState]);

    return (
        <>
            <TableContext value={{ forceRefresh, variant: props.adminAccess ? 'default' : 'tango5' }}>
                <DataTable
                    data={data}
                    rowCount={rowCount}
                    loading={loading}
                    onPaginationChange={onPaginationChange}
                    onRowClick={!props.adminAccess ? handleRowClick : undefined}
                    pagination={pagination}
                    columns={props.adminAccess ? adminColumns : userColumns}
                    initialState={{ columnVisibility: { data: false } }}
                />
            </TableContext>
            <GameSolutionViewer
                open={showSolution}
                onClose={handleCloseDialog}
                scenario={scenario}
                loading={isLoadingSolution}
            />
        </>
    );
};
