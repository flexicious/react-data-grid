import { createColumn, getApi } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import { useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

export const DynamicColumns = () => {
    const [data] = useState<Record<string, any>[]>(FlexiciousMockGenerator.instance().getFlatOrgList());
    const [fiscalYears, setFiscalYears] = useState<number[]>([]);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        toolbarOptions: {
            enableGroupingDropzone: false,
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                const toggleFinancials = () => {
                    if (fiscalYears.length > 0) {
                        setFiscalYears([]);
                    } else {
                        setFiscalYears([2020]);
                    }
                    api.propsUpdated();
                };
                return <div>
                    <button onClick={toggleFinancials}>{fiscalYears.length > 0 ? "Remove Financials" : "Add Financials"}</button>
                </div>;

            }
        },
        enableFilters: false,
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                enableCellClickRowSelect: true,
            },
            {
                ...createColumn("legalName", "string", "Legal Name"),
                enableCellClickRowSelect: true,
            },
            ...createFiscalYearColumnGroup(fiscalYears, {
                width: 100
            })

        ]
    }}></ReactDataGrid>;
};