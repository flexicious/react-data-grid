import { ApiContext, createColumn, createFilterBehavior, FilterOperation } from "@ezgrid/grid-core";
import { createTextInputFilterOptions, Expander, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useRef } from "react";
import SampleData from "../mockdata/SampleData";

export const StandAloneTreeView = () => {
    const apiRef = useRef<ApiContext | null>(null);
    return <ReactDataGrid style={{ width: "250px" }} gridOptions={{
        dataProvider: SampleData.networkData,
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
                apiRef.current?.api?.expandAll();
            }
        },
        behaviors: [createFilterBehavior({})],
        enableToolbar: false,
        enableFooters: false,
        enableDynamicLevels: true,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        nextLevel: {
            childrenField: "items",
        },
        selectionOptions: {
            enableSelectionCascade: true,
            enableSelectionBubble: true,
        },
        enableHeightAutoAdjust: true,
        columns: [
            {
                ...createColumn("id", "string", "Select All"),
                enableMove: false,
                enableFocus: false,
                enableColumnMenu: false,
                enableResize: false,
                enableSort: false,
                enableDrag: true,
                headerOptions: {
                    headerRenderer: ({ node }) => {
                        const context = node.gridOptions?.contextInfo;
                        return <div className="ezgrid-dg-toolbar-section">
                            Select All
                            {(context?.expansion?.maxExpandLevel || 0) > 1 && <Expander node={node} />}
                        </div>;
                    }
                },
                filterOptions: {
                    ...createTextInputFilterOptions(FilterOperation.BeginsWith),
                },
                enableHierarchy: true,
                selectionCheckBoxOptions: {
                    selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                    selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer
                }
            },
        ]
    }}></ReactDataGrid>;
};