import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { useTableContext } from '~/hooks/use-table-context';
import { cn } from '~/lib/utils';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const { variant } = useTableContext();

    return (
        <div
            className={cn(
                'flex items-center justify-between border-t p-2',
                variant === 'tango5' && 'border-t-0 font-barlow text-base font-light text-gray-900'
            )}>
            <div className="flex items-center gap-x-2">
                <p>Rows per page</p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                    }}>
                    <SelectTrigger
                        className={cn(
                            'h-8 w-[70px]',
                            variant === 'tango5' &&
                                'h-6 w-fit rounded-full border-gray-300 px-1.5 text-base shadow-none focus:ring-0'
                        )}>
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side={variant === 'tango5' ? 'bottom' : 'top'}>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-end gap-x-2">
                {variant === 'default' && (
                    <div className="flex w-[100px] items-center justify-end text-sm font-medium">
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                )}
                <Button
                    variant="outline"
                    className={cn(
                        'size-8 p-0',
                        variant === 'tango5' && 'size-6 rounded-full border-gray-300 bg-inherit'
                    )}
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}>
                    <span className="sr-only">First</span>
                    <ChevronsLeft />
                </Button>
                <Button
                    variant="outline"
                    className={cn(
                        'size-8 p-0',
                        variant === 'tango5' && 'size-6 rounded-full border-gray-300 bg-inherit'
                    )}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    <span className="sr-only">Prev.</span>
                    <ChevronLeft />
                </Button>
                {variant === 'tango5' && (
                    <div className="text-sm font-medium">
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                )}
                <Button
                    variant="outline"
                    className={cn(
                        'size-8 p-0',
                        variant === 'tango5' && 'size-6 rounded-full border-gray-300 bg-inherit'
                    )}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    <span className="sr-only">Next</span>
                    <ChevronRight />
                </Button>
                <Button
                    variant="outline"
                    className={cn(
                        'size-8 p-0',
                        variant === 'tango5' && 'size-6 rounded-full border-gray-300 bg-inherit'
                    )}
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}>
                    <span className="sr-only">Last</span>
                    <ChevronsRight />
                </Button>
            </div>
        </div>
    );
}
