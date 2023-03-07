import { ApiContext, ColumnWidthMode, createColumn, createFilterBehavior, createGroupingBehavior, getApi, HorizontalScrollMode, resolveExpression } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import { useRef, useState } from "react";
import Employee from "../mockdata/Employee";

export const SortOptions = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const [data] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
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
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                const doSort = () => {
                    api.setSorts([{
                        sortColumn: "stateCode",
                        isAscending: true,
                    },
                    {
                        sortColumn: "department",
                        isAscending: true,
                    }]);

                };
                return <div>
                    <button onClick={doSort}>Sort By State and Department</button>
                </div>;
            }
        },
        enableFilters: false,
        enableFooters: false,
        headerRowHeight: 75,
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            }
        }, columns: [
            {
                ...createColumn("employeeId", "string", "Id - Not sortable"),
                textAlign: "right",
                widthMode: ColumnWidthMode.Fixed,
                enableSort: false,
                width: 75,
            },
            {
                ...createColumn("firstName", "string", "First Name - case insensitive sort"),
                sortOptions: {
                    sortCaseInsensitive: true,
                }
            },
            {
                ...createColumn("lastName", "string", "Last Name - case insensitive sort"),
                sortOptions: {
                    sortCaseInsensitive: true,
                }

            },
            {
                ...createColumn("employeeIdNoSortString", "currency", "ID -string sort")
            },
            {
                ...createColumn("employeeIdString", "currency", "ID - numeric sort"),
                sortOptions: {
                    sortNumeric: true,
                }
            },
            {
                ...createColumn("workPhone", "string", "Work phone - custom sort by extension"),
                sortOptions: {
                    sortCompareFunction: (a, b) => {
                        const aWorkPhone = resolveExpression(a, "workPhone");
                        const bWorkPhone = resolveExpression(b, "workPhone");
                        const aExtension = aWorkPhone.split("x")[1];
                        const bExtension = bWorkPhone.split("x")[1];
                        return aExtension.localeCompare(bExtension);
                    }
                }
            },

            {
                ...createColumn("stateCode", "string", "State"),
            },

            {
                ...createColumn("department", "string", "Department"),
            },

        ]
    }}></ReactDataGrid>;
};