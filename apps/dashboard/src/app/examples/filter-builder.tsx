import { ColumnWidthMode, createColumn, createFilterBehavior, HorizontalScrollMode } from "@ezgrid/grid-core";
import { createMultiSelectFilterOptions, FilterBuilder, ReactDataGrid } from "@ezgrid/grid-react";
import Employee from "../mockdata/Employee";
import { getScrollOffBelow } from "../utils/column-utils";

export const FilterBuilderDemo = () => {
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: Employee.getAllEmployees(),
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        horizontalScroll: getScrollOffBelow(),
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
                filterOptions: createMultiSelectFilterOptions(),    
            },
            {
                ...createColumn("phoneNumber", "string", "Phone Number"),
            }, {
                ...createColumn("isActive", "boolean", "Active"),
            },
            {
                ...createColumn("stateCode", "string", "State"),
                filterOptions: createMultiSelectFilterOptions(),    
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