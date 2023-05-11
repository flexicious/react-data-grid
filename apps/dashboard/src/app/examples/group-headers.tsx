import { ApiContext, createColumn, GridOptions, HorizontalScrollMode } from "@ezgrid/grid-core";
import { ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useMemo, useRef } from "react";
import SampleData from "../mockdata/SampleData";

export const GroupHeaders = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const gridOptions = useMemo<GridOptions>(()=>({
        dataProvider: SampleData.networkData,
        horizontalScroll: HorizontalScrollMode.Off,
        enableFilters: false,
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
        groupHeaderOptions: {
            enableGroupHeaders: true,
            useHierarchyColumnForRenderer: true,
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
    }),[])
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={gridOptions}></ReactDataGrid>;
};