import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    InitialTableState,
    OnChangeFn,
    PaginationState,
    Row,
    useReactTable
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '~/lib/utils';
import { useTableContext } from '~/hooks/use-table-context';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowCount: number;
    loading: boolean;
    onPaginationChange: OnChangeFn<PaginationState>;
    onRowClick?: (row: Row<TData>) => void;
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
    onRowClick,
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

    const { variant } = useTableContext();

    return (
        <div className={cn(variant === 'tango5' ? 'space-y-3 rounded-3xl bg-map px-5 py-2' : 'rounded-md border')}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className={cn(variant === 'tango5' && '!border-b-[2px] border-gray-300 hover:bg-inherit')}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={cn(
                                            variant === 'tango5' &&
                                                'py-3 font-barlow text-2xl font-bold uppercase text-gray-900'
                                        )}>
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
                        <TableRow className="hover:bg-inherit">
                            <TableCell colSpan={columns.length} className="h-32 text-center">
                                <div className="flex h-full w-full items-center justify-center text-gray-900">
                                    <LoadingSpinner size={36} />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ) : (
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={cn(
                                        variant === 'tango5' &&
                                            '!border-b border-gray-300 font-barlow text-xl font-light text-gray-900 hover:bg-muted/15',
                                        onRowClick && 'cursor-pointer'
                                    )}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={cn(variant === 'tango5' && 'px-16')}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-inherit">
                                <TableCell
                                    colSpan={columns.length}
                                    className={cn(
                                        'h-24 text-center',
                                        variant === 'tango5' && 'font-barlow text-xl font-light text-gray-900'
                                    )}>
                                    {'No results'}
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
