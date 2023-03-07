import { Business } from "../../shared/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { FilterPageSortArguments, NameValue, resolveExpression, ServerResponse, formatCurrency } from "@euxdt/grid-core";
import knex from "../../knex"
import { buildKnexQuery, } from "../../shared/knex-builder";
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ServerResponse<Business> | { message: string }>
) => {
    if (req.method === "POST") {


        const filterPageSort = req.body as FilterPageSortArguments;
        const { filter, distinctValueColumns, footerValueColumns } = filterPageSort;
        const count = await buildKnexQuery(knex("businesses").count("* as count"), { filter });

        const inspectionSubquery = knex('inspections')
            .count('business_id')
            .whereRaw('inspections.business_id = businesses.business_id')
            .as('inspection_count')

        const violationSubquery = knex('violations')
            .count('business_id')
            .whereRaw('violations.business_id = businesses.business_id')
            .as('violation_count')


        //add counts of inspections and violations by business
        const businesses = await buildKnexQuery(knex("businesses"), filterPageSort).select('*', inspectionSubquery, violationSubquery)

        const footerValues: [column: string, value: string][] = await Promise.all((footerValueColumns || []).map(async (column) => {
            const inspectionsQuery = buildKnexQuery(knex("businesses"), { filter }).join("inspections", "businesses.business_id", "inspections.business_id").count("inspections.business_id");
            const value = column === "inspection_count" ? await inspectionsQuery :
                await buildKnexQuery(knex("businesses"), { filter }).join("violations", "businesses.business_id", "violations.business_id").count("violations.business_id");
            return [
                column,
                `Total: ${formatCurrency(resolveExpression(value[0], Object.keys(value[0])[0]), 0)}`
            ]
        }));

        const distinctValues: [column: string, values: NameValue[]][] = await Promise.all((distinctValueColumns || []).map(async (column) => {
            const values = await buildKnexQuery(knex("businesses").distinct(column).select(column), { filter });
            return [
                column,
                values.map((value: unknown) => {
                    return {
                        name: resolveExpression(value, column),
                        value: resolveExpression(value, column)
                    }
                })
            ]
        }));
        const toObject = (arr: [column: string, values: unknown][]) =>
            arr.reduce((obj, [column, values]) => {
                resolveExpression(obj, column, values);
                return obj;
            }, {});

        res.status(200).json(
            {
                rows: businesses,
                count: count[0].count,
                filterDistinctValues: toObject(distinctValues),
                footerValues: toObject(footerValues)
            }
        );
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
export default handler;