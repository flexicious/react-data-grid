import { createColumn, getApi, LockMode, TreeNodeType } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";

export const ColumnLockModes = () => {
    const [data] = useState<Record<string, any>[]>(FlexiciousMockGenerator.instance().getFlatOrgList());
    const [swapped, setSwapped] = useState<boolean>(true);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        nodeStyleFunction: (node) => {
            if (node.type === TreeNodeType.VDivider) {
                return { width: "3px" };
            }
            return {};
        },
        toolbarOptions: {
            enableGroupingDropzone: false,
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                return <div>

                    <button onClick={() => {
                        setSwapped(!swapped);
                        api.propsUpdated();
                    }}>Swap Lock Modes</button>
                </div>;

            }
        },
        enableFilters: false,
        headerRowHeight: 75,
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                lockMode: swapped ? LockMode.Left : LockMode.Right,
                headerOptions: { columnGroupText: "Basic Info", },
                children: [
                    {
                        ...createColumn("legalName", "string", "Legal Name"),
                    },
                ]

            },

            { ...createColumn("headquarterAddress.line1", "string", "Address Line 1") },
            { ...createColumn("headquarterAddress.line2", "string", "Address Line 2") },
            {
                ...createColumn("headquarterAddress.city.name", "string", "City"),
            },

            {
                ...createColumn("headquarterAddress.state.name", "string", "State"),
            },

            {
                ...createColumn("headquarterAddress.country.name", "string", "Country")
            },
            {
                ...createColumn("annualRevenue", "currency", "Annual Revenue"),
                width: 75,
                lockMode: swapped ? LockMode.Right : LockMode.Left,
                children: [
                    { ...createColumn("numEmployees", "number", "Num Employees"),width: 75 },
                    { ...createColumn("earningsPerShare", "number", "EPS") ,width: 75},
                    { ...createColumn("lastStockPrice", "number", "Stock Price") ,width: 75}
                ]

            },

        ]
    }}></ReactDataGrid>;
};