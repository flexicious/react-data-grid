import { ApiContext, createColumn, createFilterBehavior, FilterOperation, PreventableEvent } from "@ezgrid/grid-core";
import { createTextInputFilterOptions, Expander, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useRef, useState } from "react";
import SampleData from "../mockdata/SampleData";

export const HeaderRenderer = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const [data] = useState<Record<string, any>[]>(SampleData.networkData);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        behaviors: [
            createFilterBehavior({})
        ],
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
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
                selectionCheckBoxOptions: {
                    selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                    selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer
                },
                width: 400,
                headerOptions: {
                    headerRenderer: ({ node }) => {
                        const context = node.gridOptions?.contextInfo;
                        return <div className="ezgrid-dg-toolbar-section" onClick={(e) => e.stopPropagation()}>
                            ID
                            <input placeholder="Find ID" onChange={(e) => context?.gridApi.setGlobalFilter(e.target.value)} />
                            {(context?.expansion?.maxExpandLevel || 0) > 1 && <Expander node={node} />}
                        </div>;
                    }
                },
            },
            {
                ...createColumn("disabled", "boolean", "Disabled"),
                headerOptions: {
                    headerRenderer: ({ node }) => {
                        const doToggle = (e: PreventableEvent) => {
                            e.stopPropagation();
                            const toggle = (d: any) => {
                                d.disabled = !d.disabled;
                                d.items?.forEach(toggle);
                            };
                            data.forEach(toggle);
                            apiRef.current!.api?.repaint();
                        };
                        return <div className="ezgrid-dg-toolbar-section">
                            <button onClick={doToggle}>Toggle</button>
                        </div>;
                    }
                },
            },
            createColumn("groupName", "string", "Group Name"),
            createColumn("description", "string", "Description"),
        ]
    }}></ReactDataGrid>;
};