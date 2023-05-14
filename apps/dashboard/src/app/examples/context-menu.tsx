import { ColumnWidthMode, createColumn, GridOptions, LABELS, RendererProps } from "@ezgrid/grid-core";
import { GridContextMenu, ReactDataGrid } from "@ezgrid/grid-react";
import SampleData from "../mockdata/SampleData";

import { CellSelection, ContextMenuItem, getApi, gridCSSPrefix } from "@ezgrid/grid-core";
import { FC, useMemo, useRef } from "react";
import { getScrollOffBelow } from "../utils/column-utils";
import { DataGrid } from "../components/DataGrid";

export const ContextMenu = () => {
    const contextMenuGridOptions = useMemo<GridOptions>(() => ({
        dataProvider: SampleData.bookData,
        horizontalScroll: getScrollOffBelow(),
        enableContextMenu: true,
        enableToolbar: false,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        columns: [
            { ...createColumn("id", "string"), width: 50, widthMode: ColumnWidthMode.Fixed },
            { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
        ]
    }), []);
    const customContextMenuItemGridOptions = useMemo<GridOptions>(() => ({
        dataProvider: SampleData.bookData,
        horizontalScroll: getScrollOffBelow(),
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
            { ...createColumn("id", "string"), width: 50, widthMode: ColumnWidthMode.Fixed },
            { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
        ]
    }), []);

    const customContextMenuGridOptions = useMemo<GridOptions>(() => ({
        dataProvider: SampleData.bookData,
        horizontalScroll: getScrollOffBelow(),
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
            { ...createColumn("id", "string"), width: 50, widthMode: ColumnWidthMode.Fixed },
            { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
        ]
    }), [])

    return <div className="ezgrid-dg-toolbar-section" style={{ width: "100%", gap: 10 }}>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Context Menu Enabled</b>
            <DataGrid style={{ height: "600px", width: "100%" }} gridOptions={contextMenuGridOptions}/>
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Context Menu With CustomItems</b>
            <DataGrid style={{ height: "600px", width: "100%" }} gridOptions={customContextMenuItemGridOptions}/>
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Context Menu With Custom Renderer</b>
            <DataGrid style={{ height: "600px", width: "100%" }} gridOptions={customContextMenuGridOptions}/>
        </div>


    </div>;
};


const MyContextMenu: FC<RendererProps> = ({ node }) => {
    const { styles, box } = node;
    const menuRef = useRef<HTMLDivElement>(null);
    const api = getApi(node);
    const getReferenceCell = () => node.gridOptions?.contextInfo?.contextMenuInfo?.cell;

    const contextMenuItems: (ContextMenuItem | null)[] = [
        { className: "copy-cell-icon", label: LABELS.COPY_CELL, onClick: (c) => api.copyCells([c]) },
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
    return <div ref={menuRef} className="ezgrid-dg-context-menu ezgrid-dg-popup" style={{ ...styles, ...box }}>
        {
            customItems.map((item, index) => item ? <div key={index}> <div onClick={checkReferenceCellAndCall(item.onClick)} >
                <span className={gridCSSPrefix(item.className)} ></span>{item.label}
            </div></div> : <div style={{ borderBottom: "solid 2px red" }} key={index} />)
        }

    </div>;
};

export const ContextMenuRenderer = (props: RendererProps) => <GridContextMenu key={props.node.key} {...props} />;