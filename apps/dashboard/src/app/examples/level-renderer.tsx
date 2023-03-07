
import { ApiContext, ColumnWidthMode, createColumn, createEditBehavior, createFilterBehavior, FilterOperation, FooterOperation, GridSelectionMode, HorizontalScrollMode } from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import { createTextInputFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import { useEffect, useRef, useState } from "react";
import CustomerOrganization from "../mockdata/CustomerOrganization";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";

export const LevelRenderer = () => {
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
        <ReactDataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
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
            ],
            nextLevel: {
                nextLevelRendererOptions: {
                    nextLevelRendererHeightFunction: () => 200,
                    nextLevelRenderer: ({ node }) => {
                        return <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <ReactDataGrid
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
                            ></ReactDataGrid>
                        </div>;
                    },
                }
            }
        }} />
    );
};

