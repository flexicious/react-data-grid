
import { ColumnWidthMode, createColumn, createEditBehavior, createFilterBehavior, FilterOperation, FilterPageSortLoadMode, FooterOperation, GridSelectionMode, LockMode, RowPositionInfo, ServerInfo } from "@ezgrid/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@ezgrid/grid-export";
import { createTextInputFilterOptions, ReactDataGrid } from "@ezgrid/grid-react";
import { useEffect, useState } from "react";
import { Spinner } from "../components/spinner/Spinner";
import { getDealsForOrg, getOrganizations } from "../mockdata/MockService";
import Organization from "../mockdata/Organization";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

export const NestedLazyLoadGrid = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customLoading, setCustomLoading] = useState(false);
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [serverInfo, setServerInfo] = useState<ServerInfo>({
        childrenMap: {}
    });
    useEffect(() => {
        setIsLoading(true);
        const getOrgs = async () => {
            const orgs = await getOrganizations();
            setOrgs(orgs);
            setIsLoading(false);
        };
        getOrgs();
    }, []);

    const getServerData = async (row: RowPositionInfo) => {
        setCustomLoading(true);
        if (row.level === 1) {
            //we are an org, we need its deals
            const orgId = (row.data as Organization).id;
            const deals = await getDealsForOrg(orgId);
            const childrenMap = serverInfo?.childrenMap || {};
            childrenMap[orgId.toString()]= deals;
            setServerInfo({
                ...serverInfo,
            });
        }
        setCustomLoading(false);
    };
    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            {<ReactDataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
                dataProvider: orgs,
                isLoading,
                serverInfo,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                eventBus: {
                    onItemLoadRequested: getServerData,
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
                    enableExpander: false,
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
                    ...createFiscalYearColumnGroup([new Date().getFullYear()], { width: 75 }),
                    {
                        ...createColumn("legalName", "string", "Name"),
                        width: 300,
                    },
                    {
                        ...createColumn("annualRevenue", "currency", "Annual Revenue")
                        , children: [
                            { ...createColumn("numEmployees", "number", "Num Employees") },
                            { ...createColumn("earningsPerShare", "number", "EPS") },
                            { ...createColumn("lastStockPrice", "number", "Stock Price") }
                        ]
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
                ],
                nextLevel: {
                    childrenField: "deals",
                    itemLoadMode: FilterPageSortLoadMode.Server,
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
                                        footerLabel: "Sum: ", footerOperationPrecision: 2
                                    }
                                }
                            ]
                        }
                    }
                }
            }} />}
            {customLoading && <div style={{ position: "absolute", top: "50%", left: "50%" }}><Spinner /></div>}

        </div>
    );
};

