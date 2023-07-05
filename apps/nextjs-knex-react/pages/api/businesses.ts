import type { NextApiRequest, NextApiResponse } from "next";
import { FilterPageSortArguments, NameValue, resolveExpression, ServerInfo, formatCurrency, FilterPageSortChangeReason } from "@ezgrid/grid-core";
import knex from "../../knex"
import { buildKnexQuery, } from "../../shared/knex-builder";
import { keyValueArrayToObject } from "@ezgrid/grid-shared";
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ServerInfo | { message: string }>
) => {
    if (req.method === "POST") {
        const filterPageSort = req.body as FilterPageSortArguments;
        const { filter, distinctValueColumns, pagination, reason } = filterPageSort;
        const footerValueColumns = ["inspection_count", "violation_count"];
        const response: ServerInfo = {};
        if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged) {
            const count = await buildKnexQuery(knex("businesses").count("* as count"), { filter });
            const totalRecords = count[0].count;
            response.pagination = {
                ...pagination,
                totalRecords,
            }
        }
        if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged || reason === FilterPageSortChangeReason.SortChanged
            || reason === FilterPageSortChangeReason.PageChanged || !reason) {
            const inspectionSubquery = knex('inspections')
                .count('business_id')
                .whereRaw('inspections.business_id = businesses.business_id')
                .as('inspection_count')

            const violationSubquery = knex('violations')
                .count('business_id')
                .whereRaw('violations.business_id = businesses.business_id')
                .as('violation_count')


            //add counts of inspections and violations by business
            const businesses = await buildKnexQuery(knex("businesses"), filterPageSort).select('*', inspectionSubquery, violationSubquery);
            response.currentPageData = businesses;
        }
        if (reason === FilterPageSortChangeReason.InitialLoad || reason === FilterPageSortChangeReason.FilterChanged) {
            const footerValues: [column: string, value: string][] = await Promise.all((footerValueColumns || []).map(async (column) => {
                const inspectionsQuery = buildKnexQuery(knex("businesses"), { filter }).join("inspections", "businesses.business_id", "inspections.business_id").count("inspections.business_id");
                const value = column === "inspection_count" ? await inspectionsQuery :
                    await buildKnexQuery(knex("businesses"), { filter }).join("violations", "businesses.business_id", "violations.business_id").count("violations.business_id");
                return [
                    column,
                    `Total: ${formatCurrency(resolveExpression(value[0], Object.keys(value[0])[0]), 0)}`
                ]
            }));
            response.footerValues = keyValueArrayToObject(footerValues);
        }
        if (reason === FilterPageSortChangeReason.InitialLoad) {
            const distinctValues: [column: string, values: NameValue[]][] = await Promise.all((distinctValueColumns || []).map(async (column) => {
                const values = await buildKnexQuery(knex("businesses").distinct(column.dataField).select(column.dataField), { filter });
                return [
                    column.dataField,
                    values.map((value: unknown) => {
                        return {
                            name: resolveExpression(value, column.dataField),
                            value: resolveExpression(value, column.dataField)
                        }
                    }).filter(nv => nv.name)
                ]
            }));
            response.filterDistinctValues = keyValueArrayToObject(distinctValues);
        }

        res.status(200).json(
            {
                ...response,
            }
        );
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
export default handler;