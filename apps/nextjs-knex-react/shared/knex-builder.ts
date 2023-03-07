import { FilterPageSortArguments, FilterOperation, FilterExpression, Filter, isFilter, isFilterExpression } from '@euxdt/grid-core';
import { Knex } from 'knex';

export type Primitive = string | number | Date | boolean;
export const buildKnexQuery = (qb: Knex.QueryBuilder, { filter, pagination, sorts }: FilterPageSortArguments): Knex.QueryBuilder => {
    let queryBuilder: Knex.QueryBuilder = qb;
    console.log(pagination);
    if (pagination) {
        queryBuilder = queryBuilder.offset((pagination.currentPage - 1) * pagination.pageSize).limit(pagination.pageSize);
    }
    if (sorts) {
        console.log(sorts);
        const sortsArray = Array.from(sorts.values());
        for (const sort of sortsArray) {
            if (sort.sortColumn)
                queryBuilder = queryBuilder.orderBy(sort.sortColumn, sort.isAscending ? "asc" : "desc");
        }
    }
    if (!filter || filter.children.length === 0) {
        return queryBuilder;
    }
    for (const child of filter.children) {
        const filterExpression: FilterExpression = child as FilterExpression;
        const childFilter: Filter = child as Filter;
        if (isFilterExpression(filterExpression)) {
            const { col, operation, expression } = filterExpression;
            const column = col.dataField;
            const primitiveExpression = expression as Primitive;
            const betweenExpression = expression as { start: Primitive, end: Primitive };
            switch (operation) {
                case FilterOperation.Equals:
                    queryBuilder = queryBuilder.where(column, '=', primitiveExpression);
                    break;
                case FilterOperation.NotEquals:
                    queryBuilder = queryBuilder.where(column, '<>', primitiveExpression);
                    break;
                case FilterOperation.BeginsWith:
                    queryBuilder = queryBuilder.where(column, 'like', `${expression}%`);
                    break;
                case FilterOperation.EndsWith:
                    queryBuilder = queryBuilder.where(column, 'like', `%${expression}`);
                    break;
                case FilterOperation.Contains:
                    queryBuilder = queryBuilder.where(column, 'like', `%${expression}%`);
                    break;
                case FilterOperation.DoesNotContain:
                    queryBuilder = queryBuilder.where(column, 'not like', `%${expression}%`);
                    break;
                case FilterOperation.GreaterThan:
                    queryBuilder = queryBuilder.where(column, '>', primitiveExpression);
                    break;
                case FilterOperation.GreaterThanEquals:
                    queryBuilder = queryBuilder.where(column, '>=', primitiveExpression);
                    break;
                case FilterOperation.LessThan:
                    queryBuilder = queryBuilder.where(column, '<', primitiveExpression);
                    break;
                case FilterOperation.LessThanEquals:
                    queryBuilder = queryBuilder.where(column, '<=', primitiveExpression);
                    break;
                case FilterOperation.IsNull:
                    queryBuilder = queryBuilder.whereNull(column);
                    break;
                case FilterOperation.IsNotNull:
                    queryBuilder = queryBuilder.whereNotNull(column);
                    break;
                case FilterOperation.Between:
                    queryBuilder = queryBuilder.whereBetween(column, [betweenExpression.start, betweenExpression.end]);
                    break;
                case FilterOperation.InList:
                    queryBuilder = queryBuilder.whereIn(column, expression as Primitive[]);
                    break;
                case FilterOperation.NotInList:
                    queryBuilder = queryBuilder.whereNotIn(column, expression as Primitive[]);
                    break;
                case FilterOperation.Wildcard:
                    queryBuilder = queryBuilder.where(column, 'like', (expression?.toString() || "").replace(/\*/g, '%'));
                    break;
                default:
                    throw new Error(`Unsupported filter operation: ${operation}`);
            }
        }
        else if (isFilter(childFilter)) {
            const { logicalOperator, children } = childFilter;
            if (!children || children.length === 0) {
                continue;
            }
            let subQueryBuilder: Knex.QueryBuilder;
            if (logicalOperator === 'AND') {
                subQueryBuilder = queryBuilder.andWhere(subQuery => buildKnexQuery(subQuery, { filter: childFilter }));
            } else if (logicalOperator === 'OR') {
                subQueryBuilder = queryBuilder.orWhere(subQuery => buildKnexQuery(subQuery, { filter: childFilter }));
            } else {
                throw new Error(`Unsupported logical operator: ${logicalOperator}`);
            }
            queryBuilder = subQueryBuilder;
        }
    }
    return queryBuilder;
}


