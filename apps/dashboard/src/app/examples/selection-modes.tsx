import { CellSelection, ColumnOptions, createColumn, createSelectionColumn, getApi, GridSelectionMode, HorizontalScrollMode } from "@ezgrid/grid-core";
import { ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useState } from "react";
import Employee from "../mockdata/Employee";
import { getScrollOffBelow } from "../utils/column-utils";

export const SelectionModes = () => {
    const [data] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    const [selectionMode, setSelectionMode] = useState<GridSelectionMode>(GridSelectionMode.MultipleRows);
    const [useExcelLikeShiftAndCtrlKeys, setUseExcelLikeShiftAndCtrlKeys] = useState<boolean>(true);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        horizontalScroll: getScrollOffBelow(),
        selectionMode,
        selectionOptions: {
            rowSelectableFunction: (rowId: string) => rowId !== "1",
            cellSelectableFunction: (cell: CellSelection) => cell.rowIdentifier !== "1",
            useExcelLikeShiftAndCtrlKeys,
        },
        toolbarOptions: {
            enableGroupingDropzone: false,
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                return <div>
                    <input type="checkbox" id="useExcelLikeShiftAndCtrlKeys" name="useExcelLikeShiftAndCtrlKeys" checked={node.gridOptions.selectionOptions?.useExcelLikeShiftAndCtrlKeys} onChange={(e) => {
                        setUseExcelLikeShiftAndCtrlKeys(e.target.checked);
                        api.propsUpdated();
                    }} />
                    <label htmlFor="useExcelLikeShiftAndCtrlKeys">Use Excel Like Shift and Ctrl Keys</label>


                    <input type="radio" id="none" name="selectionMode" value="none" checked={selectionMode === GridSelectionMode.None} onChange={(e) => {
                        setSelectionMode(GridSelectionMode.None);
                        api.clearSelection();
                        api.propsUpdated();
                    }} />
                    <label htmlFor="none">None</label>
                    <input type="radio" id="single" name="selectionMode" value="single" checked={selectionMode === GridSelectionMode.SingleCell} onChange={(e) => {
                        setSelectionMode(GridSelectionMode.SingleCell);
                        api.clearSelection();
                        api.propsUpdated();
                    }} />
                    <label htmlFor="single">Single Cell</label>
                    <input type="radio" id="singleRow" name="selectionMode" value="singleRow" checked={selectionMode === GridSelectionMode.SingleRow} onChange={(e) => {
                        setSelectionMode(GridSelectionMode.SingleRow);
                        api.clearSelection();
                        api.propsUpdated();
                    }} />
                    <label htmlFor="singleRow">Single Row</label>
                    <input type="radio" id="multi" name="selectionMode" value="multi" checked={selectionMode === GridSelectionMode.MultipleCells} onChange={(e) => {
                        setSelectionMode(GridSelectionMode.MultipleCells);
                        api.clearSelection();
                        api.propsUpdated();
                    }} />
                    <label htmlFor="multi">Multiple Cells</label>
                    <input type="radio" id="multiRow" name="selectionMode" value="multiRow" checked={selectionMode === GridSelectionMode.MultipleRows} onChange={(e) => {
                        setSelectionMode(GridSelectionMode.MultipleRows);
                        api.clearSelection();
                        api.propsUpdated();
                    }} />
                    <label htmlFor="multiRow">Multiple Rows</label>
                </div>;

            }
        },
        enableFilters: false, columns: [
            (selectionMode === GridSelectionMode.MultipleRows ?  createSelectionColumn({
                itemRenderer:SelectionCheckBoxRenderer,
                headerRenderer: SelectionCheckBoxHeaderRenderer
            }) : undefined),
            {
                ...createColumn("employeeId", "string", "Id 1 Not Selectable"),
                enableCellClickRowSelect: true,
                headerOptions: {
                    headerTooltip: "This is the employee id"
                }
            },
            {
                ...createColumn("firstName", "string", "First Name"),
                enableCellClickRowSelect: true,
            },
            {
                ...createColumn("stateCode", "string", "State"),
                enableCellClickRowSelect: true,
            },

            {
                ...createColumn("department", "string", "Department"),
                enableCellClickRowSelect: true,
            },

        ].filter(c=>c != undefined) as ColumnOptions[]
    }}></ReactDataGrid>;
};