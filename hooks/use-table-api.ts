import { useEffect, useState } from 'react';
import { TableObject, TableRecord } from '~/lib/db/queries';

export function useTableApi(action: (pi: number, ps: number) => Promise<TableObject>, limit: number, offset: number) {
    const [data, setData] = useState<TableRecord[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        action(offset, limit).then(({ count, values }) => {
            setData(values);
            setRowCount(count);
            setLoading(false);
        });
    }, [limit, offset, setData, setLoading]);

    return { data, rowCount, loading };
}
