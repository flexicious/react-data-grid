import { ApiContext, createColumn, HorizontalScrollMode } from "@ezgrid/grid-core";
import { ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useRef } from "react";
import SampleData from "../mockdata/SampleData";

export const SelectionCascade = () => {
    const apiRef = useRef<ApiContext | null>(null);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: SampleData.networkData,
        horizontalScroll: HorizontalScrollMode.Off,
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
                apiRef.current?.api?.expandAll();
            }
        },
        uniqueIdentifierOptions: {
            useField: "id"
        },
        nextLevel: {
            childrenField: "items",
            nextLevel: {
                childrenField: "items",

            },

        },
        selectionOptions: {
            enableSelectionCascade: true,
            enableSelectionBubble: true,
        },
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                enableHierarchy: true,
                selectionCheckBoxOptions: {
                    selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                    selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer
                }
            },
            createColumn("groupName", "string", "Group Name"),
            createColumn("description", "string", "Description"),
            createColumn("disabled", "boolean", "Disabled"),
            createColumn("isStatic", "boolean", "Static"),
            createColumn("type", "string", "Type"),
            createColumn("iconClass", "string", "Icon Class"),
        ]
    }}></ReactDataGrid>;
};