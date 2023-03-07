import { FilterPageSortArguments,ServerResponse,NameValue } from '@euxdt/grid-core'; 
import { buildWhereClause, getRowsFromSqlite } from 'apps/graphql-apollo-react/shared/sql-builder';
import { Business } from 'apps/graphql-apollo-react/shared/types';
export const BusinessResolver = {
  Query: {
    businesses: async (
      _,
      { args }: { args: FilterPageSortArguments },
    ) : Promise<ServerResponse<Business>> => {
      const { filter, distinctValueColumns, footerValueColumns } = args;
      const params = [];
      const noPagingParams = [];
      const noPagingWhereClause = buildWhereClause( {filter}, noPagingParams, false );
      const countSelect = `select count(*) as count from businesses ${noPagingWhereClause}`;
      const count = await getRowsFromSqlite(countSelect, params)
      const businessQuery =  buildWhereClause(args,params);
      console.log(businessQuery);
      const businessSelect = `select businesses.*,
      (select count(*) from inspections where inspections.business_id = businesses.business_id) as inspection_count,
      (select count(*) from violations where violations.business_id = businesses.business_id) as violation_count
       from businesses ${businessQuery}`;
      const businesses = await getRowsFromSqlite<Business>(businessSelect,params);

      const footerValues: Record<string, string> = {};
      for(const column of footerValueColumns || []) {
        const inspectionsQuery = `select count(*) as count from inspections left join businesses on inspections.business_id = businesses.business_id ${noPagingWhereClause}`;
        const violationsQuery = `select count(*)  as count  from violations left join businesses on violations.business_id = businesses.business_id ${noPagingWhereClause}`;
        const value = column === "inspection_count" ? await getRowsFromSqlite(inspectionsQuery,noPagingParams) :
            await getRowsFromSqlite(violationsQuery,noPagingParams);
        footerValues[column] = `Total: ${value[0]["count"]}`;
      }

      // const filterDistinctValues: Record<string, NameValue[]> =await distinctValueColumns?.reduce(async (obj, column) => {
      //   const values = `select distinct ${column} from businesses ${noPagingWhereClause}`;
      //   const dbValues = await getRowsFromSqlite(values);
      //   obj[column] = dbValues.map((value: unknown) => ({name: (value as any)[column], value: (value as any)[column]}));
      // }, {}) || {};
      const filterDistinctValues: Record<string, NameValue[]> = {};
      for(const column of distinctValueColumns || []) {
        const values = `select distinct ${column} from businesses ${noPagingWhereClause}`;
        const dbValues = await getRowsFromSqlite(values,noPagingParams);
        filterDistinctValues[column] = dbValues.map((value: unknown) => ({name: (value as any)[column], value: (value as any)[column]}));
      }
      return {
        rows: businesses,
        count: (count[0] as any).count,
        footerValues,
        filterDistinctValues
      };
    },
  },
};
