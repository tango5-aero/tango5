'use client';

import { useContext, createContext } from 'react';

type Context = { forceRefresh: () => void };

export const TableContext = createContext<Context | undefined>(undefined);

export const useTableContext = () => {
    const context = useContext(TableContext);

    if (!context) {
        throw new Error('useTableContext must be used within a TableContextProvider');
    }

    return context;
};
