import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    InitialTableState,
    OnChangeFn,
    PaginationState,
    useReactTable
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { LoadingSpinner } from './loading-spinner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowCount: number;
    loading: boolean;
    onPaginationChange: OnChangeFn<PaginationState>;
    initialState?: InitialTableState;
    pagination: {
        pageSize: number;
        pageIndex: number;
    };
}

export function DataTable<TData, TValue>({
    loading,
    columns,
    data,
    onPaginationChange,
    rowCount,
    initialState,
    pagination
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState,
        manualPagination: true,
        rowCount,
        state: { pagination },
        onPaginationChange
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                {loading ? (
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-32 text-center">
                                <div className="flex h-full w-full items-center justify-center">
                                    <LoadingSpinner size={36} />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ) : (
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                )}
            </Table>
            <DataTablePagination table={table} />
        </div>
    );
}
