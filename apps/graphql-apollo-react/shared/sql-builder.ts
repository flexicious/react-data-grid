import { FilterPageSortArguments, FilterOperation, FilterExpression, Filter } from '@euxdt/grid-core';
import { isFilter, isFilterExpression } from '@euxdt/grid-shared';

const sqlite3 = require('sqlite3').verbose();

export type Primitive = string | number | Date | boolean;
export interface Sqlite3Query {
  query: string;
  params: Primitive[];
}
export const buildWhereClause = ({ filter, pagination, sorts }: FilterPageSortArguments, params:Primitive[], defaultPageLimit=true): string => {
  let query = ` `;
  if (filter && filter.children.length > 0) {
    query += ' WHERE';
    let isFirstFilter = true;
    for (const child of filter.children) {
      const filterExpression: FilterExpression = child as FilterExpression;
      const childFilter: Filter = child as Filter;
      if (isFilterExpression(filterExpression)) {
        const { col, operation, expression } = filterExpression;
        const column = col.dataField;
        const primitiveExpression = expression as Primitive;
        const arrayOfPrimitives = expression as Primitive[];
        const betweenExpression = expression as { start: Primitive, end: Primitive };
        if (isFirstFilter) {
          isFirstFilter = false;
        } else {
          query += ' AND';
        }
        switch (operation) {
          case FilterOperation.Equals:
            query += ` ${column} = ?`;
            params.push(primitiveExpression);
            break;
          case FilterOperation.NotEquals:
            query += ` ${column} <> ?`;
            params.push(primitiveExpression);
            break;
          case FilterOperation.BeginsWith:
            query += ` ${column} LIKE ?`;
            params.push(`${expression}%`);
            break;
          case FilterOperation.EndsWith:
            query += ` ${column} LIKE ?`;
            params.push(`%${expression}`);
            break;
          case FilterOperation.Contains:
            query += ` ${column} LIKE ?`;
            params.push(`%${expression}%`);
            break;
          case FilterOperation.DoesNotContain:
            query += ` ${column} NOT LIKE ?`;
            params.push(`%${expression}%`);
            break;
          case FilterOperation.GreaterThan:
            query += ` ${column} > ?`;
            params.push(primitiveExpression);
            break;
          case FilterOperation.GreaterThanEquals:
            query += ` ${column} >= ?`;
            params.push(primitiveExpression);
            break;
          case FilterOperation.LessThan:
            query += ` ${column} < ?`;
            params.push(primitiveExpression);
            break;
          case FilterOperation.LessThanEquals:
            query += ` ${column} <= ?`;
            params.push(primitiveExpression);
            break;
          case FilterOperation.IsNull:
            query += ` ${column} IS NULL`;
            break;
          case FilterOperation.IsNotNull:
            query += ` ${column} IS NOT NULL`;
            break;
          case FilterOperation.Between:
            query += ` ${column} BETWEEN ? AND ?`;
            params.push(betweenExpression.start, betweenExpression.end);
            break;
          case FilterOperation.InList:
            query += ` ${column} IN (${arrayOfPrimitives.map(() => '?').join(',')})`;
            params.push(...arrayOfPrimitives);
            break;
          case FilterOperation.NotInList:
            query += ` ${column} NOT IN (${arrayOfPrimitives.map(() => '?').join(',')})`;
            params.push(...arrayOfPrimitives);
            break;
          case FilterOperation.Wildcard:
            query += ` ${column} LIKE ?`;
            params.push((expression?.toString() || "").replace(/\*/g, '%'));
            break;
          default:
            throw new Error(`Unsupported filter operation: ${operation}`);
        }
        

      } else if (isFilter(childFilter)) {
        const { logicalOperator, children } = childFilter;
        if (!children || children.length === 0) {
          continue;
        }
        if (isFirstFilter) {
          isFirstFilter = false;
        } else {
          query += ` ${logicalOperator}`;
        }
        query += ' (';
        query += buildWhereClause({ filter: childFilter },params, false);
        query += ' )';
      }
    }
  }

  if (sorts) {
    let isFirstSort = true;
    for (const sort of sorts.values()) {
      if (sort.sortColumn) {
        if (isFirstSort) {
          query += ` ORDER BY ${sort.sortColumn} ${sort.isAscending ? 'ASC' : 'DESC'}`;
          isFirstSort = false;
        } else {
          query += `, ${sort.sortColumn} ${sort.isAscending ? 'ASC' : 'DESC'}`;
        }
      }
    }
  }

  if (pagination) {
    query += ` LIMIT ${pagination.pageSize} OFFSET ${(pagination.currentPage - 1) * pagination.pageSize}`;
  } else if(defaultPageLimit) {
    query += ` LIMIT 100 OFFSET 0`;
  }

  return query;
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