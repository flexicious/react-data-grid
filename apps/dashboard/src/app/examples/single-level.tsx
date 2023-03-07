import { createColumn, createDragColumn, createEditBehavior, createFilterBehavior, createSelectionColumn, DateRangeType, FilterOperation, FooterOperation, GridSelectionMode, LockMode } from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import { createDateFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createSelectFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@euxdt/grid-react";
import { useEffect, useState } from "react";
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
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
        dataProvider: data,
        isLoading,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        enablePaging: true,
        selectionMode: GridSelectionMode.MultipleRows,
        behaviors: [
            createFilterBehavior({ clearSelectionOnFilter: true }),
            createEditBehavior({}),
            createPdfBehavior({}),
            createExcelBehavior({}),
        ],
        toolbarOptions: {
            enablePdf: true,
            enableExcel: true,
        },
        settingsOptions: {
            settingsStorageKey: "line-items-grid"
        },
        columns: [
            {
                ...createDragColumn(),
                lockMode: LockMode.Left,
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
                ...createColumn("invoice.deal.dealDescription", "string", "7 Deal", "invoice.deal.dealDescription7"),
            },
            { ...createColumn("invoice.dueDate", "date", "9 Due Date") },
            { ...createColumn("invoice.deal.dealDescription", "string", "10 Deal") },
            { ...createColumn("invoice.deal.dealStatus.name", "string", "11 Deal Status") },
            { ...createColumn("invoice.deal.customer.legalName", "string", "12 Customer") },
            { ...createColumn("invoice.deal.customer.headquarterAddress.line1", "string", "13 Address Line 1") },
            { ...createColumn("invoice.deal.customer.headquarterAddress.line2", "string", "14 Address Line 2") },
            {
                ...createColumn("invoice.deal.customer.headquarterAddress.state.name", "string", "State"),
                filterOptions: createMultiSelectFilterOptions()
                , lockMode: LockMode.Right,
            },
            {
                ...createColumn("invoice.deal.customer.headquarterAddress.city.name", "string", "City"),
                filterOptions: {
                    ...createMultiSelectFilterOptions(),
                    useLabelFunctionForFilterCompare: true,
                }, lockMode: LockMode.Right
            },

            {
                ...createColumn("invoice.deal.customer.headquarterAddress.country.name", "string", "Country"), lockMode: LockMode.Right
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
    }} />;
};