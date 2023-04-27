import { HorizontalScrollMode, createSelectionColumn, createColumn } from "@ezgrid/grid-core";
import { ReactDataGrid, SelectionCheckBoxRenderer, SelectionCheckBoxHeaderRenderer } from "@ezgrid/grid-react";
import SampleData from "../mockdata/SampleData";

export const VariableRowHeight = () => {
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: SampleData.bookData,
        horizontalScroll: HorizontalScrollMode.Off,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        columns: [
            {
                ...createSelectionColumn({ itemRenderer: SelectionCheckBoxRenderer, headerRenderer: SelectionCheckBoxHeaderRenderer }),
            },
            createColumn("id", "number"),
            { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
            createColumn("author", "string", "Author"),
            createColumn("title", "string", "Title"),
            createColumn("genre", "string", "Genre"),
            createColumn("price", "number", "Price"),
            createColumn("publish_date", "date", "Publish Date"),
        ]
    }}></ReactDataGrid>;
};