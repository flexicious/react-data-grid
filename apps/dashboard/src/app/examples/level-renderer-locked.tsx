
import { ApiContext, ColumnWidthMode, createColumn, FilterOperation, FooterOperation, GridSelectionMode, HorizontalScrollMode, LockMode } from "@ezgrid/grid-core";
import { createTextInputFilterOptions, ReactDataGrid } from "@ezgrid/grid-react";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "../components/DataGrid";
import CustomerOrganization from "../mockdata/CustomerOrganization";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

export const LevelRendererLocked = () => {
    const [isLoading, setIsLoading] = useState(false);
    const apiContext = useRef<ApiContext | null>(null);
    const [data, setData] = useState<CustomerOrganization[]>([]);
    useEffect(() => {
        setIsLoading(true);
        const getOrgs = async () => {
            const orgs = FlexiciousMockGenerator.instance().getDeepOrgList();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setData(orgs);
            setIsLoading(false);
        };
        getOrgs();
    }, []);
    useEffect(() => {
        if (data.length > 0) {
            apiContext.current!.api!.expandAll();
        }
    }, [data]);

    return (
        <DataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
            dataProvider: data,
            isLoading,
            uniqueIdentifierOptions: {
                useField: "id"
            },
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiContext.current = (ctx);
                }

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
                    ...createColumn("annualRevenue", "currency", "Annual Revenue"),
                    width: 75
                    , children: [
                        { ...createColumn("numEmployees", "number", "Num Employees"), width: 75 },
                        { ...createColumn("earningsPerShare", "number", "EPS"), width: 75 },
                        {
                            ...createColumn("lastStockPrice", "number", "Stock Price"), width: 75
                        }
                    ],
                    lockMode: LockMode.Right,

                },
                ...createFiscalYearColumnGroup([new Date().getFullYear()])
            ],
            nextLevel: {
                nextLevelRendererOptions: {
                    nextLevelRendererHeightFunction: () => 200,
                    nextLevelRendererLeftLocked: ({ node }) => {
                        const org = (node.rowPosition?.data as CustomerOrganization);
                        return <div style={{ width: "100%", height: "100%", padding: "20px" }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Legal Name:</td>
                                        <td>{org.legalName}</td>
                                    </tr>
                                    <tr>
                                        <td>Country:</td>
                                        <td>{org.headquarterAddress.country.name}</td>
                                    </tr>
                                    <tr>
                                        <td>City:</td>

                                        <td>{org.headquarterAddress.city.name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>;
                    },
                    nextLevelRendererRightLocked: ({ node }) => {
                        const org = (node.rowPosition?.data as CustomerOrganization);
                        return <div style={{ width: "100%", height: "100%", padding: "20px" }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Annual Revenue:</td>
                                        <td>{org.annualRevenue}</td>
                                    </tr>
                                    <tr>
                                        <td>Num Employees:</td>
                                        <td>{org.numEmployees}</td>
                                    </tr>
                                    <tr>

                                        <td>Earnings Per Share:</td>
                                        <td>{org.earningsPerShare}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Stock Price:</td>
                                        <td>{org.lastStockPrice}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>;
                    },
                    nextLevelRenderer: ({ node }) => {
                        return <ReactDataGrid
                            style={{ width: "500px", height: "150px", padding: "20px" }}
                            gridOptions={
                                {
                                    enableToolbar: false,
                                    enableFooters: false,
                                    enableFilters: false,
                                    enableActiveCellHighlight: false,
                                    horizontalScroll: HorizontalScrollMode.Off,
                                    dataProvider: (node.rowPosition?.data as CustomerOrganization).deals,
                                    uniqueIdentifierOptions: {
                                        useField: "id"
                                    },
                                    columns: [
                                        {
                                            ...createColumn("dealDescription"), headerText: "Description",
                                            width: 200, widthMode: ColumnWidthMode.Fixed
                                        },
                                        {
                                            ...createColumn("dealStatus.name"), headerText: "Status",
                                            width: 100, widthMode: ColumnWidthMode.Fixed
                                        },
                                        {
                                            ...createColumn("dealAmount"), headerText: "Amount",
                                            format: "currency",
                                            textAlign: "right",
                                            width: 100, widthMode: ColumnWidthMode.Fixed
                                        },
                                        {
                                            ...createColumn("dealDate"), headerText: "Date",
                                            format: "date", width: 100, widthMode: ColumnWidthMode.Fixed
                                        },
                                    ]
                                }
                            }
                        ></ReactDataGrid>;
                    },
                }
            }
        }} />
    );
};

