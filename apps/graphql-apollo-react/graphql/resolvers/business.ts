import { buildSqlWhereClause, FilterPageSortArguments, FilterPageSortChangeReason, NameValue, ServerInfo } from '@euxdt/grid-core';
import { getRowsFromSqlite } from '@euxdt/grid-shared';
import { Business } from 'apps/graphql-apollo-react/shared/types';
const sqlite3 = require('sqlite3').verbose();
const getDb = () => new sqlite3.Database('dbs/sf-restaurants.db');
export const BusinessResolver = {
  Query: {
    businesses: async (
      _,
      { args }: { args: FilterPageSortArguments },
    ): Promise<ServerInfo> => {
      const { filter, distinctValueColumns, pagination, reason } = args;
      const params = [];
      const noPagingParams = [];
      const noPagingWhereClause = buildSqlWhereClause({ filter }, noPagingParams, false);
      const footerValueColumns = ["inspection_count", "violation_count"];
      const countSelect = `select count(*) as count from businesses ${noPagingWhereClause}`;
      const response: ServerInfo = {};
      if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged) {
        const count = await getRowsFromSqlite(getDb(), countSelect, params)
        const totalRecords = (count[0] as any).count;
        response.pagination = {
          ...pagination,
          totalRecords,
          totalPages: Math.ceil(totalRecords / pagination.pageSize || 100),
        }
      }
      if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged || reason === FilterPageSortChangeReason.SortChanged
        || reason === FilterPageSortChangeReason.PageChanged || !reason) {
        const businessQuery = buildSqlWhereClause(args, params);
        console.log(businessQuery);
        const businessSelect = `select businesses.*,
        (select count(*) from inspections where inspections.business_id = businesses.business_id) as inspection_count,
        (select count(*) from violations where violations.business_id = businesses.business_id) as violation_count
        from businesses ${businessQuery}`;
        const businesses = await getRowsFromSqlite<Business>(getDb(), businessSelect, params);
        response.currentPageData = businesses;
      }
      if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged) {

        const footerValues: Record<string, string> = {};
        for (const column of footerValueColumns || []) {
          const inspectionsQuery = `select count(*) as count from inspections left join businesses on inspections.business_id = businesses.business_id ${noPagingWhereClause}`;
          const violationsQuery = `select count(*)  as count  from violations left join businesses on violations.business_id = businesses.business_id ${noPagingWhereClause}`;
          const value = column === "inspection_count" ? await getRowsFromSqlite(getDb(), inspectionsQuery, noPagingParams) :
            await getRowsFromSqlite(getDb(), violationsQuery, noPagingParams);
          footerValues[column] = `Total: ${value[0]["count"]}`;
        }
        response.footerValues = footerValues;
      }
      if (reason === FilterPageSortChangeReason.InitialLoad) {

        const filterDistinctValues: Record<string, NameValue[]> = {};
        for (const column of distinctValueColumns || []) {
          const values = `select distinct ${column} from businesses ${noPagingWhereClause}`;
          const dbValues = await getRowsFromSqlite(getDb(), values, noPagingParams);
          filterDistinctValues[column] = dbValues.map((value: unknown) => ({ name: (value as any)[column], value: (value as any)[column] }));
        }
        response.filterDistinctValues = filterDistinctValues;
      }
      return {
        ...response,
      };
    },
  },
};
