
import { ColumnOptions, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, ServerInfo } from "@euxdt/grid-core";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { frpmNewColumns, initialVisibleColumnsFields, satScoreColumns, schoolColumns } from "../shared/types";
import { DataGrid } from "./DataGrid";


export const SchoolsDataGrid = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [request, setRequest] = useState<FilterPageSortArguments>();
    const [response, setResponse] = useState<ServerInfo>({});

    const columns = useMemo(() => ([...schoolColumns,...frpmNewColumns,...satScoreColumns,].map((c) => {
        return !initialVisibleColumnsFields.includes(c.dataField) ? { ...c, hidden: true } : c;
    })), []);
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
    }, [initialLoadDistinctValueColumns,visibleColumns]);
    useEffect(() => {
        //When the request (filter, page, sort, filter distinct value request) changes, get the data from the server.
        if (!request) return;
        const getServerInfo = async (request: FilterPageSortArguments) => {
            if (request.reason !== FilterPageSortChangeReason.FilterDistinctValuesRequested)
                setLoading(true);
            const response = await axios.post<ServerInfo>("/api/schools", request);
            const newResponse = response.data;
            setResponse(s=>{
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
        <DataGrid style={{ height: "100%", }}
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
            }} /> 
    );
};