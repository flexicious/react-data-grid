import { ColumnWidthMode, createColumn, createFilterBehavior, HorizontalScrollMode } from "@euxdt/grid-core";
import { FilterBuilder, ReactDataGrid } from "@euxdt/grid-react";
import Employee from "../mockdata/Employee";

export const FilterBuilderDemo = () => {
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: Employee.getAllEmployees(),
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        horizontalScroll: HorizontalScrollMode.Off,
        behaviors: [
            createFilterBehavior({})
        ],
        toolbarOptions: {
            filterBuilderRenderer: ({ node }) => <FilterBuilder node={node} />
        },
        enableFilters: false,
        columns: [
            {
                ...createColumn("employeeId", "string", "Id"),
                textAlign: "right",
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
            }, {
                ...createColumn("annualSalary", "currency", "Salary"),
            },
            {
                ...createColumn("hireDate", "date", "Hire Date"),
            },
            {
                ...createColumn("department", "string", "Department"),
            },

            {
                ...createColumn("phoneNumber", "string", "Phone Number"),
            }, {
                ...createColumn("isActive", "boolean", "Active"),
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