
import { ApiContext, ColumnOptions, createColumn, createFilterBehavior, createGroupingBehavior, DateRangeType, FilterOperation, FooterOperation, GridSelectionMode, itemToLabel, LockMode, RendererProps, resolveExpression } from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import { createDateFilterOptions, createGroupingColumnFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createSelectFilterOptions, createTextInputFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import { useEffect, useRef, useState } from "react";
import { materialAdapter } from "@euxdt/grid-shared";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";

export const Grouping = () => {
    const apiContext = useRef<ApiContext | null>(null);
    const [rawData] = useState<unknown[]>([...FlexiciousMockGenerator.instance().getAllLineItems()]);
    const [dataProvider, setDataProvider] = useState<unknown[]>([]);
    const [singleGroupingColumn, setSingleGroupingColumn] = useState<boolean>(true);
    const [singleGroupingFilter, setSingleGroupingFilter] = useState<boolean>(true);
    const [groupingFields, setGroupingFields] = useState<string[]>([]);
    useEffect(() => {
        doGroup();
    }, []);
    const groupData = (groupingFields: string[]) => {
        if (groupingFields.length === 0) {
            setDataProvider(rawData);
        }
        else {
            if (apiContext.current?.api) {
                const { groupedData } = apiContext.current.api.getGroupedDataProvider(rawData, groupingFields);
                setDataProvider(groupedData);
            }
        }
        setGroupingFields(groupingFields);
    };
    const doGroup = () => {
        if (apiContext.current?.api) {
            apiContext.current.api.groupBy(["invoice.deal.customer.headquarterAddress.country.name",
                "invoice.deal.customer.headquarterAddress.state.name",
                "invoice.deal.customer.headquarterAddress.city.name"]);
        }
    };
    const clearGrouping = () => {
        if (apiContext.current?.api) {
            apiContext.current.api.clearGroupBy();
        }
    };
    useEffect(() => {
        if (apiContext.current?.api && dataProvider.length > 0 && groupingFields.length > 0) {
            apiContext.current.api.expandAll();
        }
    }, [dataProvider, groupingFields.length]);
    
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <div className="euxdt-dg-toolbar-section">
                <button onClick={doGroup}>Group By Country, State and City</button>
                <button onClick={clearGrouping} disabled={groupingFields.length === 0}>Clear Grouping</button>

                <span>Grouping Columns:</span>
                <input type="radio" name="groupingView" value="single" checked={singleGroupingColumn}
                    onChange={(e) => {
                        setSingleGroupingColumn(true);
                        if (apiContext.current?.api) {
                            apiContext.current?.api.clearAllFilterValues();
                            apiContext.current?.api.propsUpdated();
                        }
                    }} />
                <label htmlFor="single">Single</label>
                <input type="radio" name="groupingView" value="multi" checked={!singleGroupingColumn}
                    onChange={(e) => {
                        setSingleGroupingColumn(false);
                        if (apiContext.current?.api) {
                            apiContext.current?.api.clearAllFilterValues();
                            apiContext.current?.api.propsUpdated();
                        }
                    }} />
                <label htmlFor="multi">Multiple</label>
                {
                    singleGroupingColumn && groupingFields.length > 0 &&
                    <div className="euxdt-dg-toolbar-section">|
                        <span>Grouping Filter:</span>
                        <input type="radio" name="groupingFilter" value="single" checked={singleGroupingFilter}
                            onChange={(e) => {
                                setSingleGroupingFilter(true);
                                if (apiContext.current?.api) {
                                    apiContext.current?.api.clearAllFilterValues();
                                    apiContext.current?.api.propsUpdated();
                                }
                            }} />
                        <label htmlFor="single">Single</label>
                        <input type="radio" name="groupingFilter" value="multi" checked={!singleGroupingFilter}
                            onChange={(e) => {
                                setSingleGroupingFilter(false);
                                if (apiContext.current?.api) {
                                    apiContext.current?.api.clearAllFilterValues();
                                    apiContext.current?.api.propsUpdated();
                                }
                            }} />
                        <label htmlFor="multi">Multiple</label>
                        </div>

                }


            </div>
            {
                <ReactDataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
                    dataProvider,
                    uniqueIdentifierOptions: {
                        useField: "id"
                    },
                    adapter:  materialAdapter,
                    eventBus: {
                        onApiContextReady: (ctx) => {
                            apiContext.current = (ctx);
                        },
                        onGroupingFieldsChanged: groupData
                    },

                    enableFloatingHeaderRows: true,
                    floatingRowsOptions: {
                        maxFloatingRows: groupingFields.length,
                        floatingColumns: ["group",...groupingFields],
                    },
                    selectionMode: GridSelectionMode.MultipleRows,
                    behaviors: [
                        createFilterBehavior({
                            clearSelectionOnFilter: true,
                        }),
                        createPdfBehavior({}),
                        createExcelBehavior({}),
                        createGroupingBehavior({}),
                    ],
                    toolbarOptions: {
                        enablePdf: true,
                        enableExcel: true,
                        enableSettings: false,
                        enableGroupingDropzone: true,

                    },
                    sortOptions: ({
                        initialSort: [{
                            sortColumn: "id",
                            isAscending: true,
                        }]
                    }),
                    enableDynamicLevels: true,
                    nextLevel: {
                        childrenField: "children",
                    },
                    columns: [
                        {
                            ...createColumn("group", "string", "Group"),
                            filterOptions: singleGroupingFilter ? {
                                ...createMultiSelectFilterOptions(),
                                filterComboBoxBuildFromGridHierarchy: true,
                                filterCompareFunction: (item: unknown, col: ColumnOptions, value: unknown) => {
                                    const selectedItems = value as string[];
                                    const id = resolveExpression(item, "id");
                                    return (selectedItems.find((item) => item.endsWith(id))) !== undefined; 
                                }
                            }:
                            {
                                ...createGroupingColumnFilterOptions(),
                                filterCompareFunction: (item: unknown, col: ColumnOptions, value: unknown) => {
                                    const selectedItems = value as Record<string, string[]>;
                                    const props = Object.keys(selectedItems);
                                    for (let i = 0; i < props.length; i++) {
                                        const prop = props[i];
                                        const selectedValues = selectedItems[prop];
                                        const propValue = resolveExpression(item, prop);
                                        if (selectedValues.find((item) => item === propValue) !== undefined) {
                                            return true;
                                        }   
                                    }
                                    return false;
                                }
                            }
                            , lockMode: LockMode.Left,
                            enableHierarchy: true,
                            width: 200,
                            hidden: groupingFields.length === 0 ? true : !singleGroupingColumn,
                        },
                        {
                            ...createColumn("invoice.deal.customer.headquarterAddress.country.name", "string", "Country"), lockMode: LockMode.Left,
                            enableHierarchy: !singleGroupingColumn,
                            itemRenderer: blankInnerLevelRenderer,
                            hidden: singleGroupingColumn && groupingFields.includes("invoice.deal.customer.headquarterAddress.country.name"),
                        },
                        {
                            ...createColumn("invoice.deal.customer.headquarterAddress.state.name", "string", "State"),
                            filterOptions: createMultiSelectFilterOptions()
                            , lockMode: LockMode.Left,
                            itemRenderer: blankInnerLevelRenderer,
                            enableHierarchy: !singleGroupingColumn,
                            hidden: singleGroupingColumn && groupingFields.includes("invoice.deal.customer.headquarterAddress.state.name"),
                        },
                        {
                            ...createColumn("invoice.deal.customer.headquarterAddress.city.name", "string", "City"),
                            filterOptions: createMultiSelectFilterOptions(), lockMode: LockMode.Left,
                            itemRenderer: blankInnerLevelRenderer,
                            enableHierarchy: !singleGroupingColumn,
                            hidden: singleGroupingColumn && groupingFields.includes("invoice.deal.customer.headquarterAddress.city.name"),
                        },
                        {
                            ...createColumn("lineItemAmount", "currency"),
                            textAlign: "right", headerText: "Line Item Amount",
                            filterOptions: createNumericRangeFilterOptions(),
                            footerOptions: { footerOperation: FooterOperation.Sum }
                        },
                        {
                            ...createColumn("invoice.id", "string", "Invoice Number"),
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
                            ...createColumn("invoice.deal.customer.annualRevenue", "currency", "Annual Revenue")
                            , children: [
                                { ...createColumn("invoice.deal.customer.numEmployees", "number", "Num Employees") },
                                { ...createColumn("invoice.deal.customer.earningsPerShare", "number", "EPS") },
                                { ...createColumn("invoice.deal.customer.lastStockPrice", "number", "Stock Price") }
                            ]
                        },
                    ]
                }} />
            }
        </div>
    );
};

const blankInnerLevelRenderer = (props: RendererProps) => {
    const rowPosition = props.node.rowPosition;
    const colPosition = props.node.columnPosition;
    const level = rowPosition?.level;
    if (!rowPosition || !colPosition || (level && level > 3)) {
        return <div></div>;
    }
    const data = itemToLabel(rowPosition.data, colPosition.column);
    return <div>{data}</div>;
};