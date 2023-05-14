import { ApiContext, ColumnWidthMode, createColumn, getApi, GridOptions, HorizontalScrollMode } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { useMemo, useRef, useState } from "react";
import Employee from "../mockdata/Employee";
import { getScrollOffBelow } from "../utils/column-utils";
import { DataGrid } from "../components/DataGrid";

export const ColumnWidthModes = () => {
    const apiRef = useRef<ApiContext<Employee> | null>(null);
    const [horizontalScrollMode, setHorizontalScrollMode] = useState<HorizontalScrollMode>(getScrollOffBelow());
    const [data] = useState<Employee[]>(Employee.getAllEmployees());
    const gridOptions = useMemo<GridOptions<Employee>>(()=> ({
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },

        toolbarOptions: {
            enableGroupingDropzone: false,
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                return <div>
                    <label htmlFor="horizontalScrollMode">Horizontal Scroll Mode</label>
                    <input type="radio" name="horizontalScrollMode" id="horizontalScrollModeOff" value="off" checked={horizontalScrollMode === HorizontalScrollMode.Off} onChange={(e) => {
                        setHorizontalScrollMode(HorizontalScrollMode.Off);
                        api.propsUpdated();
                    }} />
                    <label htmlFor="horizontalScrollModeOff">Off</label>
                    <input type="radio" name="horizontalScrollMode" id="horizontalScrollModeOn" value="on" checked={horizontalScrollMode === HorizontalScrollMode.On} onChange={(e) => {
                        setHorizontalScrollMode(HorizontalScrollMode.On);
                        api.propsUpdated();
                    }} />
                    <label htmlFor="horizontalScrollModeOn">On</label>

                </div>;

            }
        },

        horizontalScroll: horizontalScrollMode,
        enableFilters: false,
        headerRowHeight: 75,

        cellStyleFunction: (node) => {
            if ((node?.classNames || "").indexOf("group-header-cell") > -1) {
                return {
                    whiteSpace: "normal",
                };
            }
            return {};
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            }
        }, columns: [
            {
                ...createColumn("firstName", "string", "First Name - 25% width"),
                headerOptions: { columnGroupText: "First Name and last name take 50% of the width" },
                widthMode: ColumnWidthMode.Percent,
                percentWidth: 25,
                children: [

                    {
                        ...createColumn("lastName", "string", "Last Name - First Name - 25% width"),
                        widthMode: ColumnWidthMode.Percent,
                        percentWidth: 25,

                    },
                ]

            },

            {
                ...createColumn("employeeId", "string", "Id - Fixed column width"),
                textAlign: "right",
                widthMode: ColumnWidthMode.Fixed,
                enableResize: false,
                width: 75,
            },
            {
                ...createColumn("department", "string", "Department - Fit content"),
                widthMode: ColumnWidthMode.FitToContent,
            },
            {
                ...createColumn("stateCode", "string", "State"),
                headerOptions: { columnGroupText: "If not enough space for remaining columns, they will shrink equally in HorizontalScrollMode=off, or scroll when HorizontalScrollMode=on (default). If extra space, they will expand equally regardless of HorizontalScrollMode" },
                children: [
                    {
                        ...createColumn("workPhone", "string", "Phone"),
                    },
                    {
                        ...createColumn("annualSalary", "currency", "Salary"),
                    },
                    {
                        ...createColumn("hireDate", "date", "Hire Date"),
                    },
                ]
            },

        ]
    }), [data, horizontalScrollMode]);
    return <DataGrid style={{ height: "100%", width: "100%" }} gridOptions={gridOptions}/>;
};