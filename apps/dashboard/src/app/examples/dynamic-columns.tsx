import { GridOptions, createColumn, getApi } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { useMemo, useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import { createFiscalYearColumnGroup } from "../utils/column-utils";
import Organization from "../mockdata/Organization";

export const DynamicColumns = () => {
    const [data] = useState<Organization[]>(FlexiciousMockGenerator.instance().getFlatOrgList());
    const [fiscalYears, setFiscalYears] = useState<number[]>([]);
    const gridOptions = useMemo<GridOptions<Organization>>(()=>({
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        toolbarOptions: {
            enableGroupingDropzone: false,
            rightToolbarRenderer: () => {
                const toggleFinancials = () => {
                    if (fiscalYears.length > 0) {
                        setFiscalYears([]);
                    } else {
                        setFiscalYears([2020]);
                    }
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
            ...createFiscalYearColumnGroup<Organization>(fiscalYears, {
                width: 100
            })

        ]
    }),[fiscalYears,data,setFiscalYears])
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={gridOptions}></ReactDataGrid>;
};