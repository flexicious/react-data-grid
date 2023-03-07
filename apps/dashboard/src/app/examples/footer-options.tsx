import { ApiContext, ColumnOptions, ColumnWidthMode, createColumn, createFilterBehavior, createGroupingBehavior, FooterOperation, getApi, HorizontalScrollMode } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import { useRef, useState } from "react";
import Employee from "../mockdata/Employee";

export const FooterOptions = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const [data] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        enableContextMenu: true,
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        horizontalScroll: HorizontalScrollMode.Off,
        behaviors: [createGroupingBehavior({}),
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
                ...createColumn("employeeId", "string", "Id - Count Footer"),
                textAlign: "right",
                footerOptions: {
                    footerLabel: "Count:",
                    footerOperation: FooterOperation.Count
                },
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
            }, {
                ...createColumn("annualSalary", "currency", "Annual Salary - Avg Footer"),
                footerOptions: {
                    footerOperation: FooterOperation.Avg
                },
            },
            {
                ...createColumn("hireDate", "date", "Hire Date - Max Footer"),
                footerOptions: {
                    footerLabel: "Latest:",
                    footerOperation: FooterOperation.Max
                }

            },
            {
                ...createColumn("department", "string", "Department - Custom Footer Renderer"),
                footerOptions: {
                    footerRenderer: ({ node }) => {
                        const api = getApi(node);
                        const filteredDataProvider = api.getFilteredDataProvider();
                        const { groupedData } = api.getGroupedDataProvider(filteredDataProvider || [], ["department"]);
                        return <div style={{ display: "flex", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "end" }}>
                            {groupedData.map((group: any, index) => {
                                return <div key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "end", alignItems: "center", gap: 5 }}>
                                    <div>{group.group}:</div>
                                    <div>{group.children.length}</div>
                                </div>;
                            })}
                        </div>;
                    },
                },
            },

            {
                ...createColumn("phoneNumber", "string", "Phone Number - Custom Footer Label Function"),
                footerOptions: {
                    footerLabelFunction: (col: ColumnOptions, dp: unknown[] | undefined) => {
                        const api = apiRef.current?.api;
                        if (!api) return "";
                        const { groupedData } = api.getGroupedDataProvider(dp || [], ["isActive"]);
                        const retVal = groupedData.map((group: any) => {
                            return `${group.group ? "Y" : "N"}: ${group.children.length}`;
                        }).join(", ");
                        return retVal;
                    }
                }

            }, {
                ...createColumn("isActive", "boolean", "Active - No footer"),
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
            },
            {
                ...createColumn("stateCode", "string", "State"),
            },
            {
                ...createColumn("firstName", "string", "First Name"),
            },
            {
                ...createColumn("lastName", "string", "Last Name"),
            }

        ]
    }}></ReactDataGrid>;
};