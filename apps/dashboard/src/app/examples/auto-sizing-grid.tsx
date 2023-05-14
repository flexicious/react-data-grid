import { GridOptions, createColumn } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "../components/DataGrid";

export const AutoSizingGrid = () => {
    const [data, setData] = useState<any[]>([]);
    const addNewObject = () => ({ number: (data?.length || 0) + 1, value: Math.random() * 1000 });
    useEffect(() => {
    const data = [];
    for (let i = 0; i < 5; i++) {
       data.push( {
        ...addNewObject(),
        number: i + 1

       });
    }
    setData(data);

    }, []);
    const gridOptions = useMemo<GridOptions>(() => ({
        isMemo: true,
        dataProvider: data,
        enableFooters: false,
        enableFilters: false,
        toolbarOptions: {
            leftToolbarRenderer: () => {
                return <div className="ezgrid-dg-toolbar-section">
                    <button onClick={() => {
                        const obj = addNewObject();
                        setData([...data, obj]);
                    }}>Add New</button>
                </div>;
            },
        },
        uniqueIdentifierOptions: {
            useField: "number"
        },
        enableHeightAutoAdjust: true,
        columns: [
            createColumn("number", "string", "Id Number"),
            createColumn("value", "string", "Value"),
        ]
    }), [data]);

    return <DataGrid style={{ width: "500px" }} gridOptions={gridOptions}/>;
};