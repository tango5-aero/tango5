import { useEffect, useState } from 'react';

type TableObject<T> = {
    count: number;
    values: T[];
};

export function useTableApi<TRecord>(
    action: (pageIndex: number, pageSize: number) => Promise<TableObject<TRecord>>,
    limit: number,
    offset: number
) {
    const [data, setData] = useState<TRecord[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const useRefresh = useState(false);
    const [refresh, _] = useRefresh;

    useEffect(() => {
        setLoading(true);

        action(offset, limit).then(({ count, values }) => {
            setData(values);
            setRowCount(count);
            setLoading(false);
        });
    }, [limit, offset, setData, setLoading, refresh]);

    return { data, rowCount, loading, useRefresh };
}
