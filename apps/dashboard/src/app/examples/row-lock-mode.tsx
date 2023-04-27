import { ApiContext, createColumn, createFilterBehavior, getFlatColumns, LockMode, RowType } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { useEffect, useRef, useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

export const LockedRows = () => {
    const apiContext = useRef<ApiContext | null>(null);

    const [data] = useState<any[]>(FlexiciousMockGenerator.instance().getFlatOrgList());
    const [median, setMedian] = useState<any[]>([{}, {}, {}]);
    useEffect(() => {
        const newOrg = data[0];
        if (newOrg) {
            const medianRow = { ...newOrg };
            medianRow.legalName = "Calculated Median:";
            medianRow.id = "Med";

            const maxRow = { ...newOrg };
            maxRow.legalName = "Calculated Max:";
            maxRow.id = "Min";

            const minRow = { ...newOrg };
            minRow.legalName = "Calculated Min:";
            minRow.id = "Max";

            const fields = getFlatColumns(createFiscalYearColumnGroup([new Date().getFullYear()]), null).map(c => c.dataField);
            fields.forEach(f => {
                medianRow[f] = data.reduce((acc, cur) => acc + cur[f], 0) / data.length;
                maxRow[f] = Math.max(...data.map(d => d[f]));
                minRow[f] = Math.min(...data.map(d => d[f]));
            });

            setMedian([medianRow, maxRow, minRow]);
        }
    }, [data]);

    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        lockedDataProvider: median,
        enableFilters: false,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        cellStyleFunction: (node) => {
            if (node.rowPosition?.type === RowType.LockedBody) {
                return { backgroundColor: "lightgray" };
            }
            return {};
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                apiContext.current = (ctx);
            },
        },
        enableContextMenu: false,
        behaviors: [createFilterBehavior({})],
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                enableCellClickRowSelect: true,
                lockMode: LockMode.Left,
            },
            {
                ...createColumn("legalName", "string", "Legal Name"),
                enableCellClickRowSelect: true,
                lockMode: LockMode.Left,
            },
            ...createFiscalYearColumnGroup([new Date().getFullYear()], {
                width: 100
            })

        ]
    }}></ReactDataGrid>;
};