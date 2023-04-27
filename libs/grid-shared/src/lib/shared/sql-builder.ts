import { resolveExpression } from "@ezgrid/grid-core";


export type Primitive = string | number | Date | boolean;
export interface Sqlite3Query {
  query: string;
  params: Primitive[];
}

export const getRowsFromSqlite = async<T>(db: any, query: string, params: any): Promise<T[]> => {
  const rows = await new Promise((resolve, reject) => {
    db.all(query, params, (err: Error, rows: T[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  db.close();
  return rows as T[];
}

export const keyValueArrayToObject = (arr: [column: string, values: unknown][]) =>
  arr.reduce((obj, [column, values]) => {
    resolveExpression(obj, column, values);
    return obj;
  }, {});
