'use client';

import { Dispatch, SetStateAction, useContext, createContext } from 'react';

type Context = [boolean, Dispatch<SetStateAction<boolean>>];

export const TableContext = createContext<Context | undefined>(undefined);

export const useTableContext = () => {
    const context = useContext(TableContext);

    if (!context) {
        throw new Error('useTableContext must be used within a TableContextProvider');
    }

    return context;
};
