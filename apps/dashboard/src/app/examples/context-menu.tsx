import { ColumnWidthMode, createColumn, HorizontalScrollMode, LABELS, RendererProps } from "@euxdt/grid-core";
import { GridContextMenu, ReactDataGrid } from "@euxdt/grid-react";
import SampleData from "../mockdata/SampleData";

import { CellSelection, ContextMenuItem, getApi, gridCSSPrefix } from "@euxdt/grid-core";
import { useRef, FC } from "react";

export const ContextMenu = () => {
    return <div className="euxdt-dg-toolbar-section" style={{ width: "100%", gap: 10 }}>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Context Menu Enabled</b>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: SampleData.bookData,
                horizontalScroll: HorizontalScrollMode.Off,
                enableContextMenu: true,
                enableToolbar: false,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                columns: [
                    { ...createColumn("id", "number"), width: 50, widthMode: ColumnWidthMode.Fixed },
                    { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
                ]
            }}></ReactDataGrid>
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Context Menu With CustomItems</b>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: SampleData.bookData,
                horizontalScroll: HorizontalScrollMode.Off,
                enableContextMenu: true,
                enableToolbar: false,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                contextMenuOptions: {
                    contextMenuItems: (node, currentItems) => {
                        return [...currentItems, null, {
                            label: "Custom Menu Item",
                            onClick: () => {
                                alert("Custom Menu Item Clicked");
                            },
                            className: "copy-table-icon"
                        }];
                    },
                },
                columns: [
                    { ...createColumn("id", "number"), width: 50, widthMode: ColumnWidthMode.Fixed },
                    { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
                ]
            }}></ReactDataGrid>
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Context Menu With Custom Renderer</b>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: SampleData.bookData,
                horizontalScroll: HorizontalScrollMode.Off,
                enableContextMenu: true,
                enableToolbar: false,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                contextMenuOptions: {
                    contextMenuItems: (node, currentItems) => {
                        return [...currentItems, null, {
                            label: "Custom Menu Item",
                            onClick: () => {
                                alert("Custom Menu Item Clicked");
                            },
                            className: "copy-table-icon"
                        }];
                    },
                    contextMenuRenderer: (props: RendererProps) => <MyContextMenu {...props} />
                },
                columns: [
                    { ...createColumn("id", "number"), width: 50, widthMode: ColumnWidthMode.Fixed },
                    { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
                ]
            }}></ReactDataGrid>
        </div>


    </div>;
};


const MyContextMenu: FC<RendererProps> = ({ node }) => {
    const { styles, box } = node;
    const menuRef = useRef<HTMLDivElement>(null);
    const api = getApi(node);
    const getReferenceCell = () => node.gridOptions?.contextInfo?.contextMenuInfo?.cell;

    const contextMenuItems: (ContextMenuItem | null)[] = [
        { className: "copy-cell-icon", label: LABELS.COPY_CELL, onClick: api.copyCell },
        { className: "copy-row-icon", label: LABELS.COPY_ROW, onClick: api.copyRow },
        null,
        { className: "copy-column-icon", label: LABELS.COPY_COLUMN, onClick: api.copyColumn },
        { className: "copy-table-icon", label: LABELS.COPY_TABLE, onClick: api.copyAll },
        null,
        { className: "copy-cell-icon", label: LABELS.COPY_SELECTED_CELLS, onClick: api.copySelectedCells },
        { className: "copy-row-icon", label: LABELS.COPY_SELECTED_ROWS, onClick: api.copySelectedRows },
    ];
    const customItems = node.gridOptions.contextMenuOptions?.contextMenuItems?.(node, contextMenuItems) || contextMenuItems;

    const checkReferenceCellAndCall = (callback: (cell: CellSelection) => void) => {
        return () => {
            const referenceCell = getReferenceCell();
            if (referenceCell) {
                callback(referenceCell);
            }
            api.showHideContextMenu(false);
        };
    };
    return <div ref={menuRef} className="euxdt-dg-context-menu euxdt-dg-popup" style={{ ...styles, ...box }}>
        {
            customItems.map((item, index) => item ? <div key={index}> <div onClick={checkReferenceCellAndCall(item.onClick)} >
                <span className={gridCSSPrefix(item.className)} ></span>{item.label}
            </div></div> : <div style={{ borderBottom: "solid 2px red" }} key={index} />)
        }

    </div>;
};

export const ContextMenuRenderer = (props: RendererProps) => <GridContextMenu key={props.node.key} {...props} />;