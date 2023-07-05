import { buildSqlWhereClause, ColumnOptions, FilterPageSortArguments, FilterPageSortChangeReason, FooterOperation, formatCurrency, formatNumber, NameValue, ServerInfo } from "@ezgrid/grid-core";
import { getRowsFromSqlite } from "@ezgrid/grid-shared";
import { frpmNewColumns, numericColumns, satScoreColumns, School, schoolColumns } from "../../../../libs/grid-shared/src/lib/shared/types";
import type { NextApiRequest, NextApiResponse } from "next";
const sqlite3 = require('sqlite3').verbose();
const getDb = () => new sqlite3.Database('dbs/earthquakes.db');

const sqlColMap = {
    "timeYear" : "CAST(strftime('%Y', time) as INTEGER)",
    "timeMonth" : "CAST(strftime('%m', time) as INTEGER)",
    "timeDay" : "CAST(strftime('%d', time) as INTEGER)",
}
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ServerInfo | { message: string }>
) => {
    const tableName = "quakes";
    if (req.method === "POST") {
        const filterPageSort: FilterPageSortArguments = req.body;
        const allCols = filterPageSort.visibleColumns;
        const numericColumns = allCols.filter((column) => column.footerOptions?.footerOperation !== undefined);
        const response: ServerInfo = {};
        if(filterPageSort.globalFilterTree?.children?.length > 0){
            filterPageSort.filter = filterPageSort.globalFilterTree;
        }
        const { filter, distinctValueColumns, visibleColumns, pagination, reason, groupFields } = filterPageSort;
        const fromClause = ` from ${tableName} `;

        let params = [];
        if(groupFields?.length){
            filterPageSort.sorts = filterPageSort.sorts?.filter((sort) => groupFields.find(col => col.dataField === sort.sortColumn) !== undefined);
        }
        const noPagingWhereClause = buildSqlWhereClause({ filter }, params, false, true, sqlColMap);
        const footerColumns = visibleColumns.filter((column) => numericColumns.find((col) => col.dataField === column.dataField));
        params = params.map((param) => param === "true" ? 1 : param === "false" ? 0 : param);
        //get current page
        if (reason !== FilterPageSortChangeReason.FilterDistinctValuesRequested) {
            let whereClause = buildSqlWhereClause(filterPageSort, [], true, true, sqlColMap);
            const getSqlCol = (column: ColumnOptions) =>  sqlColMap[column.dataField] || column.dataField;
              
            const groupByClause = groupFields?.length ? ` group by ${groupFields.map(getSqlCol).join(",")}` : "";
            let selectFields = allCols.map((column) => `${getSqlCol(column)} as "${column.dataField}"`).join(",")
            if(groupFields?.length){
                const groupingSelectCols =[...groupFields.map((column) => `${getSqlCol(column)} as "${column.dataField}"`),
            ...footerColumns.map((column) => `${column.footerOptions?.footerOperation.toLowerCase()||"avg"}(${column.dataField}) as "${column.dataField}"`)];
                selectFields = groupingSelectCols.join(",");
                whereClause = whereClause.replace(" WHERE"," HAVING");
            }
            const selectStatement = `select 
            ${selectFields}
            ${fromClause}
            ${groupByClause}
            ${whereClause}`;
            response.currentPageData = await getRowsFromSqlite(getDb(), selectStatement, params);
        }
        //get footer values and totals for pagination
        if ((reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged ) && (visibleColumns?.length || 0)) {
            const footerValues: Record<string, string> = {};
            
            const selectClause = `select ${footerColumns.map((column) => `${column.footerOptions?.footerOperation.toLowerCase()||"avg"}(${column.dataField}) as "${column.dataField}"`).join(",")}`;
            const footerResult = await getRowsFromSqlite(getDb(),`${selectClause} ${fromClause} ${noPagingWhereClause}`, params);
            for (const column of footerColumns || []) {
                const result = footerResult[0][column.dataField] || footerResult[0][column.dataField.toLowerCase()];
                const operation = column.footerOptions?.footerOperation || FooterOperation.Avg;
                if (result)
                    footerValues[column.dataField] = `${operation}: ${operation===FooterOperation.Count? formatNumber(result) : formatCurrency(result)}`;
            }
            response.footerValues = footerValues;
            const countSelect = `select count(*) as count ${fromClause} ${noPagingWhereClause}`;
            const count =   await getRowsFromSqlite(getDb(), countSelect, params)
            const totalRecords = (count[0] as any).count;
            response.pagination = {
                ...pagination,
                totalRecords,
            }
        }
        //get distinct values
        if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterDistinctValuesRequested) {
            const filterDistinctValues: Record<string, NameValue[]> = {};
            for (const column of distinctValueColumns || []) {
                const values = `select distinct ${column.dataField} from ${tableName} `;
                const dbValues = await getRowsFromSqlite(getDb(),values, []);
                filterDistinctValues[column.dataField] = dbValues.map((value: unknown) => ({ name: (value as any)[column.dataField] || (value as any)[column.dataField.toLowerCase()], value: (value as any)[column.dataField] || (value as any)[column.dataField.toLowerCase()] }));
            }
            response.filterDistinctValues = filterDistinctValues;
        }
        res.send(response);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
export default handler;