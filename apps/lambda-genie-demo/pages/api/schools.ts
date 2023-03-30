import { buildSqlWhereClause, ColumnOptions, FilterPageSortArguments, FilterPageSortChangeReason, formatCurrency, NameValue, ServerInfo } from "@euxdt/grid-core";
import { getRowsFromSqlite } from "@euxdt/grid-shared";
import { CONFIG } from "../../shared/lambda-genie/config-bindings";
import { loadConfigApi } from "../../shared/lambda-genie/config-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { executeRule } from "@euxdt/node-rules-engine";
const sqlite3 = require('sqlite3').verbose();
const dbLocation = process.env.DB_LOCATION || "dbs/schools.db";
const getDb = () => new sqlite3.Database(dbLocation);

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ServerInfo | { message: string }>
) => {
    if (req.method === "POST") {
        const lambdaName = CONFIG.LAMBDA_CONFIGS.GET_SCHOOL_DETAILS.NAME;
        const environment = CONFIG.ENVIRONMENTS.DEV;
        const configApi = await loadConfigApi(lambdaName);
        const config = await configApi.getAllConfigValues(environment);
        const allCols = (config[CONFIG.LAMBDA_CONFIGS.GET_SCHOOL_DETAILS.GRID_COLUMN_DEFINITION] as unknown as ColumnOptions[])
        const numericColumns = allCols.filter((column) => column.format === "number");
        const filterPageSort = req.body as FilterPageSortArguments;
        const response: ServerInfo = {};
        const { filter, distinctValueColumns, visibleColumns, pagination, reason } = filterPageSort;
        const fromClause = ` from  schools
        left JOIN satscores ON satscores.cds = schools.CDSCode
        left JOIN frpm_new ON frpm_new.CDSCode = schools.CDSCode `;

        let params = [];
        const noPagingWhereClause = buildSqlWhereClause({ filter }, params, false);
        params = params.map((param) => param === "true" ? 1 : param === "false" ? 0 : param);
        //get total count
        if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged) {
            const countSelect = `select count(*) as count ${fromClause} ${noPagingWhereClause}`;
            const count = await getRowsFromSqlite(getDb(), countSelect, params);
            const totalRecords = (count[0] as any).count;
            response.pagination = {
                ...pagination,
                totalRecords,
                totalPages: Math.ceil(totalRecords / pagination.pageSize || 100),
            }
        }
        //get current page
        if (reason !== FilterPageSortChangeReason.FilterDistinctValuesRequested) {
            const schoolQuery = buildSqlWhereClause(filterPageSort, []);
            const schoolSelect = `select 
            ${allCols.map((column) => `${column.dataField} as '${column.dataField}'`).join(",")}
            ${fromClause}
            ${schoolQuery}`;
            // console.log("schoolSelect", schoolSelect);
            const schools = await getRowsFromSqlite(getDb(), schoolSelect, params);
            // console.log("currentPageData", schools.length);
            const colorRule = configApi.configJson.ruleSets.find((ruleSet) => ruleSet.name === CONFIG.RULE_SETS.SCHOOL_ROW_COLOR);
            schools.forEach((school: any) => {
                const colorRuleResult = executeRule(colorRule,
                    configApi.configJson.predefinedLists, {
                    PercentEligibleFreeK12: school["frpm_new.PercentEligibleFreeK12"],
                }, environment);
                school.rowColor = colorRuleResult?.result || "";
            });

            response.currentPageData = schools;
        }
        //get footer values
        if ((reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged) && (visibleColumns?.length || 0)) {
            const footerValues: Record<string, string> = {};
            const visibleNumericColumns = visibleColumns.filter((column) => numericColumns.find((col) => col.dataField === column));
            const selectClause = `select ${visibleNumericColumns.map((column) => `avg(${column}) as '${column}'`).join(",")}`;
            // console.log("selectClause", params);
            const footerResult = await getRowsFromSqlite(getDb(), `${selectClause} ${fromClause} ${noPagingWhereClause}`, params);
            for (const column of visibleNumericColumns || []) {
                const result = footerResult[0][column];
                if (result)
                    footerValues[column] = `Avg: ${formatCurrency(footerResult[0][column])}`;
            }
            response.footerValues = footerValues;
        }
        //get distinct values
        if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterDistinctValuesRequested) {
            const filterDistinctValues: Record<string, NameValue[]> = {};
            for (const column of distinctValueColumns || []) {
                const table = column.split(".")[0];
                const col = column.split(".")[1];
                const values = `select distinct ${col} from ${table} `;
                const dbValues = await getRowsFromSqlite(getDb(), values, []);
                filterDistinctValues[column] = dbValues.map((value: unknown) => ({ name: (value as any)[col], value: (value as any)[col] }));
            }
            response.filterDistinctValues = filterDistinctValues;
        }
        res.status(200).json(
            {
                ...response,
            });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
export default handler;