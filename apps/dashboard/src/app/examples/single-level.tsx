import { createColumn, createDragColumn, createSelectionColumn, DateRangeType, FilterOperation, FooterOperation, GRID_CONSTANTS, GridOptions, GridSelectionMode, LockMode, VirtualTreeNode } from "@ezgrid/grid-core";
import { ChartBuilder, createDateFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createSelectFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, FilterBuilder, FormulaColumnEditor, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "../components/DataGrid";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import LineItem from "../mockdata/LineItem";

export const SingleLevel = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<LineItem[]>([]);
    useEffect(() => {
        setIsLoading(true);
        const getLineItems = async () => {
            const orgs = FlexiciousMockGenerator.instance().getAllLineItems();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setData(orgs);
            setIsLoading(false);
        };
        getLineItems();
    }, []);
    const gridOptions = useMemo<GridOptions<LineItem>>(() => ({
        dataProvider: data,
        isLoading,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        enablePaging: true,
        selectionMode: GridSelectionMode.MultipleRows,
        toolbarOptions: {
            enablePdf: true,
            enableExcel: true,
            filterBuilderRenderer: ({ node } : {node:VirtualTreeNode}) => <FilterBuilder node={node} />,
            chartBuilderRenderer: ({ node } : {node:VirtualTreeNode}) => <ChartBuilder node={node} />,
            addFormulaColumnRenderer: ({ node } : {node:VirtualTreeNode}) => <FormulaColumnEditor node={node} />,
        },
        settingsOptions: {
            settingsStorageKey: "line-items-grid"
        },
        columns: [
            {
                ...createDragColumn(),
                lockMode: LockMode.Left,
                hidden: window.innerWidth < GRID_CONSTANTS.MOBILE_CUTOFF,
            },
            {

                ...createSelectionColumn({ itemRenderer: SelectionCheckBoxRenderer, headerRenderer: SelectionCheckBoxHeaderRenderer }),
                lockMode: LockMode.Left,
            },

            {
                ...createColumn("id"), headerText: "Invoice Number", lockMode: LockMode.Left,
                footerOptions: {
                    footerOperation: FooterOperation.Count, footerLabel: "Count: "
                },
                width: 125,
                textAlign: "center",
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
            },
            {
                ...createColumn("invoice.hasPdf", "boolean", "Pdf?"),
                filterOptions: createTriStateCheckBoxFilterOptions(),
                width: 50,
            },

            {
                ...createColumn("lineItemAmount", "currency"),
                textAlign: "right", headerText: "Line Item Amount",
                filterOptions: createNumericRangeFilterOptions(),
                footerOptions: { footerOperation: FooterOperation.Max, footerLabel: "Max: " }
            }
            ,

            {
                ...createColumn("invoice.invoiceStatus.name", "string", "Invoice Status"),
                filterOptions: createSelectFilterOptions(),
            },
            {
                ...createColumn("invoice.invoiceDate", "date", "Invoice Date"),
                filterOptions: createDateFilterOptions([
                    DateRangeType.LastYear,
                    DateRangeType.LastMonth,
                    DateRangeType.LastWeek,
                    DateRangeType.Today,
                    DateRangeType.ThisWeek,
                    DateRangeType.ThisMonth,
                    DateRangeType.ThisYear,
                    DateRangeType.NextYear,
                    DateRangeType.NextMonth,
                    DateRangeType.NextWeek,
                    DateRangeType.Custom
                ]),
            },

            {
                ...createColumn("lineItemDescription", "string", "Line Item Description"),
                width: 300,
                filterOptions: createTextInputFilterOptions(FilterOperation.Contains)
            },

            {
                ...createColumn("invoice.deal.dealDescription", "string", "Deal", "invoice.deal.dealDescription7"),
            },
            {
                ...createColumn("invoice.deal.customer.headquarterAddress.state.name", "string", "State"),
                filterOptions: createMultiSelectFilterOptions()
            },
            {
                ...createColumn("invoice.deal.customer.headquarterAddress.city.name", "string", "City"),
                filterOptions: {
                    ...createMultiSelectFilterOptions(),
                    useLabelFunctionForFilterCompare: true,
                }
            },

            {
                ...createColumn("invoice.deal.customer.headquarterAddress.country.name", "string", "Country")
            },
            {
                ...createColumn("invoice.deal.customer.annualRevenue", "currency", "Annual Revenue")
                , children: [
                    { ...createColumn("invoice.deal.customer.numEmployees", "number", "Num Employees") },
                    { ...createColumn("invoice.deal.customer.earningsPerShare", "number", "EPS") },
                    { ...createColumn("invoice.deal.customer.lastStockPrice", "number", "Stock Price") }
                ]

            },
        ]
    }), [data, isLoading]);
    return <DataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={gridOptions} />;
};