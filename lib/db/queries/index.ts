export * from './usergames';
export * from './scenarios';
export * from './users';

export type TableRecord = Record<string, string | number | boolean | unknown>;

export type TableObject = {
    count: number;
    values: TableRecord[];
};
