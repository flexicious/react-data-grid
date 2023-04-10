import { createColumn } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import { useEffect, useState } from "react";

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

    return <ReactDataGrid style={{ width: "500px" }} gridOptions={{
        dataProvider: data,
        enableFooters: false,
        enableFilters: false,
        toolbarOptions: {
            leftToolbarRenderer: ({ node }) => {
                return <div className="euxdt-dg-toolbar-section">
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
    }}></ReactDataGrid>;
};