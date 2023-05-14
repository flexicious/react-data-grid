import { HorizontalScrollMode, createSelectionColumn, createColumn, GridOptions } from "@ezgrid/grid-core";
import { ReactDataGrid, SelectionCheckBoxRenderer, SelectionCheckBoxHeaderRenderer } from "@ezgrid/grid-react";
import SampleData from "../mockdata/SampleData";
import { useMemo } from "react";
import { DataGrid } from "../components/DataGrid";

export const VariableRowHeight = () => {
    const gridOptions = useMemo<GridOptions>(() => ({
        dataProvider: SampleData.bookData,
        horizontalScroll: HorizontalScrollMode.Off,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        columns: [
            {
                ...createSelectionColumn({ itemRenderer: SelectionCheckBoxRenderer, headerRenderer: SelectionCheckBoxHeaderRenderer }),
            },
            createColumn("id", "string"),
            { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
            createColumn("author", "string", "Author"),
            createColumn("title", "string", "Title"),
            createColumn("genre", "string", "Genre"),
            createColumn("price", "number", "Price"),
            createColumn("publish_date", "date", "Publish Date"),
        ]
    }), []);
    return <DataGrid style={{ height: "100%", width: "100%" }} gridOptions={gridOptions}/>;
};