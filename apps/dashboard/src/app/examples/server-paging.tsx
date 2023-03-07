
import { ApiContext, ColumnWidthMode, createColumn, createEditBehavior, createFilterBehavior, createSelectionColumn, DateRangeType, GRID_CONSTANTS, FilterOperation, FilterPageSortArguments, FilterPageSortLoadMode, FooterOperation, GridSelectionMode, LockMode, ServerInfo } from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import { createDateFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createSelectFilterOptions, createTextInputFilterOptions, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@euxdt/grid-react";
import { useEffect, useRef, useState } from "react";
import { getPagedData } from "../mockdata/MockService";
export const ServerPaging = () => {
    const apiContext = useRef<ApiContext | null>(null);
    const [serverInfo, setServerInfo] = useState<ServerInfo>();
    const [filterPageSortArgs, setFilterPageSortArgs] = useState<FilterPageSortArguments>();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setFilterPageSortArgs({
            filter: {children:[]},
            globalFilter: "",
            pagination: { pageSize: GRID_CONSTANTS.DEFAULT_PAGE_SIZE, currentPage: 1 },
        });
    }, []);
    useEffect(() => {
        if (!filterPageSortArgs) return;
        const getServerData = async (filterPageSortArgs: FilterPageSortArguments) => {
            const { filter, globalFilter, pagination, sorts } = filterPageSortArgs;
            if (!apiContext.current?.api) return;
            apiContext.current?.api.suspendMouseEvents();
            setIsLoading(true);
            const cols = apiContext.current?.api.getFlatColumns();
            const data = await getPagedData(filter ||{children:[]}, globalFilter || "", pagination || {
                pageSize: GRID_CONSTANTS.DEFAULT_PAGE_SIZE,
                currentPage: 1
            }, sorts,
                undefined,
                (cols.filter(col => col.filterOptions?.filterComboBoxBuildFromGrid).map((col) => col.dataField) || []),
                (cols.filter(col => col.footerOptions?.footerOperation).map((col) => {
                    return {
                        ...col.footerOptions,
                        column: col.dataField
                    };
                }) || []));
            setIsLoading(false);
            setServerInfo(data);
            apiContext.current?.api.resumeMouseEvents();
        };
        getServerData(filterPageSortArgs);
    }, [filterPageSortArgs]);
    return (
        <ReactDataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
            isLoading,
            dataProvider: serverInfo?.currentPageData || [],
            filterPageSortMode: FilterPageSortLoadMode.Server,
            uniqueIdentifierOptions: {
                useField: "id"
            },
            serverInfo,
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiContext.current = (ctx);
                },
                onFilterPageSortChanged: (args: FilterPageSortArguments) => {
                    setFilterPageSortArgs(args);
                },
            },
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
            enablePaging: true,
            sortOptions: ({
                initialSort: [{
                    sortColumn: "id",
                    isAscending: true,
                }]
            }),
            columns: [
                {
                    ...createSelectionColumn({ itemRenderer: SelectionCheckBoxRenderer, headerRenderer: SelectionCheckBoxHeaderRenderer }),
                },
                {
                    ...createColumn("id"), headerText: "ID",
                    widthMode: ColumnWidthMode.FitToContent, textAlign: "right",
                    footerOptions: {
                        footerOperation: FooterOperation.Count, footerLabel: "Count: "
                    },
                    filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
                },

                {
                    ...createColumn("lineItemAmount", "currency"),

                    textAlign: "right", headerText: "Line Item Amount",
                    filterOptions: createNumericRangeFilterOptions(),
                    footerOptions: { footerOperation: FooterOperation.Max, footerLabel: "Max: " }
                }
                ,

                { ...createColumn("invoice.id", "number", "Invoice Number") }
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
                { ...createColumn("invoice.dueDate", "date", "9 Due Date") },
                { ...createColumn("invoice.deal.dealDescription", "string", "10 Deal") },
                { ...createColumn("invoice.deal.dealStatus.name", "string", "11 Deal Status") },
                { ...createColumn("invoice.deal.customer.legalName", "string", "12 Customer") },
                { ...createColumn("invoice.deal.customer.headquarterAddress.line1", "string", "13 Address Line 1") },
                { ...createColumn("invoice.deal.customer.headquarterAddress.line2", "string", "14 Address Line 2") },
                { ...createColumn("invoice.deal.customer.headquarterAddress.city.name", "string", "City") },

                {
                    ...createColumn("invoice.deal.customer.headquarterAddress.state.name", "string", "State"),
                    filterOptions: createMultiSelectFilterOptions()
                    , lockMode: LockMode.Right,
                },
                {
                    ...createColumn("invoice.deal.customer.headquarterAddress.country.name", "string", "Country")
                },
                {
                    ...createColumn("invoice.deal.customer.annualRevenue", "currency", "Annual Revenue"),
                    lockMode: LockMode.Right
                    , children: [
                        { ...createColumn("invoice.deal.customer.numEmployees", "number", "Num Employees") },
                        { ...createColumn("invoice.deal.customer.earningsPerShare", "number", "EPS") },
                        { ...createColumn("invoice.deal.customer.lastStockPrice", "number", "Stock Price") }
                    ]
                },
                {
                    ...createColumn("2022", "number")
                    , children: [
                        {
                            ...createColumn("Q1", "number")

                            , children: [
                                { ...createColumn("Jan", "currency") },
                                { ...createColumn("Feb", "currency") },
                                { ...createColumn("Mar", "currency") },
                            ]
                        },
                        {
                            ...createColumn("Q2", "number"),
                            children: [
                                { ...createColumn("Apr", "currency") },
                                { ...createColumn("May", "currency") },
                                { ...createColumn("Jun", "currency") },
                            ]
                        },
                        {
                            ...createColumn("Q3", "number"),
                            children: [
                                { ...createColumn("Jul", "currency") },
                                { ...createColumn("Aug", "currency") },
                                { ...createColumn("Sep", "currency") },
                            ]
                        },
                        {
                            ...createColumn("Q4", "number"),
                            children: [
                                { ...createColumn("Oct", "currency") },
                                { ...createColumn("Nov", "currency") },
                                { ...createColumn("Dec", "currency") },
                            ]
                        },
                    ]
                },
            ]
        }} />
    );
};

