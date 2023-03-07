import { FilterPageSortArguments, buildSqlWhereClause } from '@euxdt/grid-core';

const sqlite3 = require('sqlite3').verbose();

export type Primitive = string | number | Date | boolean;
export interface Sqlite3Query {
  query: string;
  params: Primitive[];
}
export const buildWhereClause = ({ filter, pagination, sorts }: FilterPageSortArguments, params:Primitive[], defaultPageLimit=true): string => {
  return buildSqlWhereClause({ filter, pagination, sorts }, params, defaultPageLimit);
};

export const getRowsFromSqlite = async<T>(query: string, params): Promise<T[]> => {
  const db = new sqlite3.Database('dbs/sf-restaurants.db');
  const rows = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
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