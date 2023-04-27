
import { ApiContext, ColumnWidthMode, createColumn, FilterOperation, FooterOperation, GridSelectionMode, LockMode, NodeKeys, RowType, VirtualTreeNode } from "@ezgrid/grid-core";
import { createTextInputFilterOptions } from "@ezgrid/grid-react";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "../components/DataGrid";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import Organization from "../mockdata/Organization";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

export const NestedGrid = () => {
    const apiContext = useRef<ApiContext | null>(null);
    const [dataProvider, setDataProvider] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        const getOrgs = async () => {
            const orgs = FlexiciousMockGenerator.instance().getDeepOrgList();
            //emulating a server call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setDataProvider(orgs);
            setIsLoading(false);
        };
        getOrgs();
    }, []);
    useEffect(() => {
        if (apiContext.current?.api && dataProvider.length > 0) {
            apiContext.current.api.expandAll();
        }
    }, [dataProvider]);

    return (
        <DataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
            dataProvider,
            isLoading,
            enableFloatingHeaderRows: true,
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiContext.current = (ctx);
                }
            },
            cellStyleFunction: (node: VirtualTreeNode) => {
                //style the header, footer, filter, and group headers outside the body
                if (node.rowPosition?.uniqueIdentifier === RowType.Header
                    || node.rowPosition?.uniqueIdentifier === RowType.Footer
                    || node.rowPosition?.uniqueIdentifier === RowType.Filter
                    || (node.classNames?.indexOf("group-header-cell") || 0) > 0) {
                    return { background: "#F2F5F8" };
                }
                return { borderRight: "none", };
            },
            nodeStyleFunction: (node: VirtualTreeNode) => {
                //toobar is neither a row or a cell, so we need to style it separately
                if (node.key === NodeKeys.Toolbar) {
                    return { background: "#ECF0F6" };
                }
                return node.styles;
            },
            rowStyleFunction(node: VirtualTreeNode) {
                //use the level to determine the background color inside the body
                const level = node.rowPosition?.level || 1;
                const isActive = (node.rowPosition?.uniqueIdentifier === node.gridOptions.contextInfo?.modifications.activeCell?.rowIdentifier);
                //rgb(242, 245, 248)  rgb(236, 240, 246) rgb(227, 231, 239) rgb(227, 231, 239) rgb(227, 231, 239) rgb(227, 231, 239)
                const shades = ["#FFFFFF", "#F2F5F8", "#ECF0F6", "#E3E7EF", "#D5DAE3", "#C8CDD7"];
                return { background: isActive ? "#F2F5F8" : shades[level + 1], borderTop: "solid 1px " + shades[level] };
            },
            uniqueIdentifierOptions: {
                useField: "id"
            },
            selectionMode: GridSelectionMode.MultipleRows,
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
            settingsOptions: {
                settingsStorageKey: "nested-grid"
            },
            columns: [
                {
                    ...createColumn("id"), headerText: "ID",
                    enableHierarchy: true,
                    footerOptions: {
                        footerOperation: FooterOperation.Count, footerLabel: "Count: "
                    },
                    widthMode: ColumnWidthMode.Fixed,
                    width: 200,
                    lockMode: LockMode.Left,
                    filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
                },
                {
                    ...createColumn("legalName", "string", "Name"),
                    width: 300,
                },
                {
                    ...createColumn("headquarterAddress.country.name", "string", " Country")
                },
                {
                    ...createColumn("headquarterAddress.city.name", "string", " City")
                },
                {
                    ...createColumn("headquarterAddress.state.name", "string", " State")
                },
                {
                    ...createColumn("annualRevenue", "currency", "Annual Revenue")
                    , children: [
                        { ...createColumn("numEmployees", "number", "Num Employees") },
                        { ...createColumn("earningsPerShare", "number", "EPS") },
                        { ...createColumn("lastStockPrice", "number", "Stock Price") }
                    ]
                },
                ...createFiscalYearColumnGroup([new Date().getFullYear()])
            ],
            nextLevel: {
                childrenField: "deals",
                columns: [
                    {
                        ...createColumn("id"), headerText: "Deal ID",
                        uniqueIdentifier: "DealID",
                        enableHierarchy: true,
                        widthMode: ColumnWidthMode.Fixed,
                        width: 200,
                        lockMode: LockMode.Left,

                    },
                    {
                        ...createColumn("dealDescription"), headerText: "Description",
                        widthMode: ColumnWidthMode.Fixed,
                        width: 300,
                    },
                    {
                        ...createColumn("dealStatus.name"), headerText: "Status",
                    },
                    {
                        ...createColumn("dealAmount"), headerText: "Amount",
                        format: "currency",
                        textAlign: "right"
                    },
                    {
                        ...createColumn("dealDate"), headerText: "Date",
                        format: "date"
                    },
                    {
                        ...createColumn("billable"), headerText: "Billable?",
                        format: "boolean"
                    }

                ],
                nextLevel: {
                    childrenField: "invoices",
                    columns: [
                        {
                            ...createColumn("id"), headerText: "Invoice ID",
                            uniqueIdentifier: "InvoiceID",
                            enableHierarchy: true,
                            widthMode: ColumnWidthMode.Fixed,
                            width: 200,
                            lockMode: LockMode.Left,

                        },
                        {
                            ...createColumn("invoiceDate"), headerText: "Invoice Date",
                            format: "date"
                        },
                        {
                            ...createColumn("dueDate"), headerText: "Due Date",
                            format: "date"
                        },
                        {
                            ...createColumn("invoiceStatus.name"), headerText: "Status",
                        },
                        {
                            ...createColumn("hasPdf"), headerText: "Has PDF?",
                            format: "boolean"
                        },
                        {
                            ...createColumn("invoiceAmount"), headerText: "Invoice Amount",
                            format: "currency", textAlign: "right"
                        }
                    ],
                    nextLevel: {
                        childrenField: "lineItems",
                        enableFooters: true,
                        columns: [
                            {
                                ...createColumn("id"), headerText: "Line Item ID",
                                uniqueIdentifier: "LineItemID",
                                enableHierarchy: true,
                                widthMode: ColumnWidthMode.Fixed,
                                width: 200,
                                lockMode: LockMode.Left,

                            },
                            {
                                ...createColumn("lineItemDescription"), headerText: "Line Item Description",
                            },
                            {
                                ...createColumn("lineItemAmount"), headerText: "Line Item Amount",
                                format: "currency", textAlign: "right",
                                footerOptions: {
                                    footerOperation: FooterOperation.Sum,
                                     footerOperationPrecision: 2
                                }
                            }
                        ]
                    }
                }
            }
        }} />
    );
};

