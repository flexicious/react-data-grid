import { ApiContext, createColumn, createEditBehavior, createFilterBehavior, FilterOperation, GridOptions, GridSelectionMode, LockMode, TreeNodeType } from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import { createSelectFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, Expander, Exporter, FilterChips, Paginator, ReactDataGrid, Selection, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer, SettingsMenu, ToolbarRight } from "@euxdt/grid-react";
import { useRef, useState } from "react";
import SampleData from "../mockdata/SampleData";

const createNode = (gridOptions: GridOptions) => ({
    gridOptions,
    key: "Expander",
    type: TreeNodeType.Renderer,
    box: {}
});
export const CustomToolbar = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const [, setToggle] = useState(0);
    return <div style={{ display: "flex", flexDirection: "column", height: "600px", width: "100%" }}>
        <div>Make a responsive toolbar outside the grid:</div>
        {apiRef.current?.context?.gridOptions &&
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ background: "aqua", borderRadius: 5, padding: 5 }}>
                    Settings:
                    <SettingsMenu node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
                <div style={{ background: "gold", borderRadius: 5, padding: 5 }}>
                    Export:
                    <Exporter node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
                <div style={{ background: "lightblue", borderRadius: 5, padding: 5 }}>
                    Expansion:   <Expander node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
                <div style={{ background: "lightpink", borderRadius: 5, padding: 5 }}>
                    Filter/Find:
                    <ToolbarRight node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
                <div style={{ background: "orange", borderRadius: 5, padding: 5 }}>
                    Pagination:
                    <Paginator node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
                <div style={{ background: "lightgreen", borderRadius: 5, padding: 5 }}>
                    Filters: <FilterChips node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
                <div style={{ background: "peachpuff", borderRadius: 5, padding: 5 }}>
                    Selection:  <Selection node={createNode(apiRef.current?.context?.gridOptions)} />
                </div>
            </div>
        }
        <ReactDataGrid style={{ flex: 1 }} gridOptions={{
            dataProvider: SampleData.networkData,
            enablePaging: true,
            uniqueIdentifierOptions: {
                useField: "id"
            },
            nextLevel: {
                childrenField: "items",
            },
            settingsOptions: {
                settingsStorageKey: "custom-toolbar"
            },
            enableDynamicLevels: true,
            selectionMode: GridSelectionMode.MultipleRows,
            enableToolbar: false,
            toolbarOptions: {
                enableFilterchips: false,
                enablePdf: true,
                enableExcel: true,
            },
            selectionOptions: {
                enableSelectionCascade: true,
                enableSelectionBubble: true,
            },
            enableFooters: false,
            enableFilters: true,
            behaviors: [
                createEditBehavior({}),
                createFilterBehavior({}),
                createPdfBehavior({}),
                createExcelBehavior({}),
            ],
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiRef.current = ctx;
                    ctx.api?.expandAll();
                    //trigger render for our external toolbar
                    setToggle(Math.random());
                },
                onBuilt: () => {
                    //trigger render for our external toolbar
                    setToggle(Math.random());
                },
                onRowSelectionChanged: (e) => {
                    //trigger render for our external toolbar
                    setToggle(Math.random());
                }
            },
            columns: [
                {
                    ...createColumn("id", "string", "Id"),
                    width: 200,
                    lockMode: LockMode.Left,
                    enableHierarchy: true,
                    selectionCheckBoxOptions: {
                        selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                        selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer
                    },
                    filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
                },
                {
                    ...createColumn("groupName", "string", "Group Name"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
                },
                {
                    ...createColumn("description", "string", "Description"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
                },
                {
                    ...createColumn("disabled", "boolean", "Disabled"),
                    filterOptions: createTriStateCheckBoxFilterOptions()
                },
                {
                    ...createColumn("isStatic", "boolean", "Static"),
                    filterOptions: createTriStateCheckBoxFilterOptions()
                },
                {
                    ...createColumn("type", "string", "Type"),
                    filterOptions: createSelectFilterOptions(),
                },

            ]
        }}></ReactDataGrid>
    </div >;
};