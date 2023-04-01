
import { ColumnOptions, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, GridOptions, ServerInfo } from "@euxdt/grid-core";
import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { GridConfig } from "../shared/lambda-genie/config-bindings";
import { DataGrid } from "./DataGrid";

export interface SchoolsDataGridProps {
    gridConfig?: GridConfig;
    gridColumnConfig?: ColumnOptions[];
    colorEvaluator?: (value: number) => string;
}

export const SchoolsDataGrid = (props: SchoolsDataGridProps) => {
    const { gridConfig, gridColumnConfig } = props;
    const columns = useMemo(() => gridColumnConfig, [gridColumnConfig]);
    const [loading, setLoading] = useState<boolean>(true);
    const [request, setRequest] = useState<FilterPageSortArguments>();
    const [response, setResponse] = useState<ServerInfo>({});


    const uniqueIdentifierOptions = useMemo(() => ({
        useField: "schools.CDSCode",
    }), []);
    const initialLoadDistinctValueColumns = useMemo(() => [], []);//Which distinct values preload, and which are loaded on demand.
    const visibleColumns = useMemo(() => columns.filter((c) => !c.hidden).map((c) => c.dataField), [columns]);
    useEffect(() => {
        //Initial load
        setRequest({
            distinctValueColumns: initialLoadDistinctValueColumns,
            filter: { children: [] },
            pagination: { pageSize: 100, currentPage: 1 },
            visibleColumns,
            reason: FilterPageSortChangeReason.InitialLoad,
        });
    }, [initialLoadDistinctValueColumns, visibleColumns]);
    useEffect(() => {
        //When the request (filter, page, sort, filter distinct value request) changes, get the data from the server.
        if (!request) return;
        const getServerInfo = async (request: FilterPageSortArguments) => {
            if (request.reason !== FilterPageSortChangeReason.FilterDistinctValuesRequested)
                setLoading(true);
            const response = await axios.post<ServerInfo>("/api/schools", request);

            const newResponse = response.data;
            setResponse(s => {
                //Merge the new response with the old response.
                if (Object.keys(response.data.filterDistinctValues || {}).length > 0) {
                    newResponse.filterDistinctValues = { ...s.filterDistinctValues, ...response.data.filterDistinctValues };
                }
                return {
                    ...s,
                    ...newResponse,
                };
            });
            setLoading(false);
        };
        getServerInfo(request);
    }, [request]);


    return (
        <div style={{ height: "100%", width: "100%", display: "flex", gap: 10 }}>
            <DataGrid style={{ height: "100%", flex: 3 }}
                gridOptions={{
                    dataProvider: response?.currentPageData,
                    filterPageSortMode: FilterPageSortLoadMode.Server,
                    enablePaging: true,
                    serverInfo: response,
                    toolbarOptions: {
                        enableGlobalSearch: false,
                        enableExcel: true,
                        enablePdf: true,
                    },
                    cellStyleFunction: (node) => {
                        const rowColor = node.rowPosition?.data?.['rowColor'];
                        const isPercentCol = node.columnPosition.column?.dataField === "frpm_new.PercentEligibleFreeK12";
                        if (isPercentCol && rowColor)
                            return { backgroundColor: rowColor };
                        return {};
                    },
                    eventBus: {
                        onFilterDistinctValuesRequested: (col: ColumnOptions) => {
                            setRequest({
                                ...request,
                                distinctValueColumns: [col.dataField],
                                reason: FilterPageSortChangeReason.FilterDistinctValuesRequested
                            });
                            return true;
                        },
                        onFilterPageSortChanged: (args: FilterPageSortArguments, reason: FilterPageSortChangeReason) => {
                            setRequest({
                                ...args,
                                reason,
                                distinctValueColumns: [],//don't need distinct values on subsequent calls
                            });
                        },
                        onExportPageRequested: async (args) => {
                            const result = await axios.post<ServerInfo>("/api/schools", args);
                            return result.data.currentPageData || [];
                        },
                    },
                    isLoading: loading,
                    uniqueIdentifierOptions,
                    columns,
                    ...gridConfig,
                } as GridOptions} />
            <div>
                <TextField multiline rows={20} />
            </div>
        </div>

    );
};