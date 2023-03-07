import { ApiContext, ColumnWidthMode, createColumn, createFilterBehavior, createGroupingBehavior, HorizontalScrollMode } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import { useEffect, useRef, useState } from "react";

import StyleEditor from "react-style-editor";

import Employee from "../mockdata/Employee";
export const CssStyling = () => {
    const style = useRef<HTMLStyleElement | null>(null);
    const defaultCss = `
    .euxdt-dg-odd-row {
        background-color: #f5f5f5;
        border-top: 1px solid #e0e0e0;
    }
    .euxdt-dg-even-row {
        background-color: #fff;
        border-top: 1px solid #e0e0e0;
    }
    .euxdt-dg-selected-row,.euxdt-dg-selected-cell {
        background-color: lightpink;
    }
    .euxdt-dg-body-scroller .euxdt-dg-active-cell,
    .euxdt-dg-body-scroller .euxdt-dg-active-row {
        background-color: lightblue;
    }

    .euxdt-dg-cell {
        border-right: none;
    }
    .euxdt-dg-header-cell {
        background-color: #e0e0e0;
    }
    .euxdt-dg-header-cell:hover {
        background-color: #f0f0f0;
    }
    .euxdt-dg-footer-cell {
        background-color: #e0e0e0;
    }
    .euxdt-dg-footer-cell:hover {
        background-color: #f0f0f0;
    }
    .euxdt-dg-toolbar {
        background-color: #e0e0e0;
    }
    .euxdt-dg-header-renderer{
        font-weight: 600;
    }
    .euxdt-dg-hdivider {
        height: 2px
    }
    
    `;
    useEffect(() => {
        style.current = document.createElement("style");
        style.current.innerHTML = defaultCss;
        document.head.appendChild(style.current);
        return () => {
            document.head.removeChild(style.current!);
        };
    }, [defaultCss]);


    const apiRef = useRef<ApiContext | null>(null);
    const [data,] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    return <div style={{ width: "100%", display: "flex" }}>
        <div style={{ flex: 1, flexShrink: 0 }}>
            <b>Small Sample of a few CSS classes you can use to fully customize the appearance of the Grid. Please see icons.css and styles.css for a full list.</b>
            <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
                dataProvider: data,
                uniqueIdentifierOptions: {
                    useField: "employeeId"
                },
                horizontalScroll: HorizontalScrollMode.Off,
                behaviors: [ 
                createFilterBehavior({})
                ],
                toolbarOptions: {
                    enableGroupingDropzone: false,
                },
                enableFilters: false,
                footerRowHeight: 75,
                headerRowHeight: 75,
                eventBus: {
                    onApiContextReady: (ctx) => {
                        apiRef.current = ctx;
                    }
                }, columns: [
                    {
                        ...createColumn("employeeId", "string", "Id"),
                        textAlign: "right",
                        widthMode: ColumnWidthMode.Fixed,
                        width: 75,
                    }, {
                        ...createColumn("annualSalary", "currency", "Annual Salary"),
                    },
                    {
                        ...createColumn("hireDate", "date", "Hire Date"),
                    },
                    {
                        ...createColumn("department", "string", "Department"),
                    },

                    {
                        ...createColumn("phoneNumber", "string", "Phone Number"),

                    },
                ]
            }}></ReactDataGrid>
        </div>
        <div style={{ height: "600px", width: "300px" }}>
            <b>Uncheck items below to see how the effect of the custom css.</b>
            <StyleEditor defaultValue={defaultCss} onChange={(css: string) => {
                if (style.current) {
                    style.current.innerHTML = css;
                }
            }}

            />
        </div>
    </div>;
};