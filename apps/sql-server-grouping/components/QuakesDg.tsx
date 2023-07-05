import { ReactDataGrid } from "@ezgrid/grid-react";
import { DISTINCT_COLS, EarthquakeData, INITIAL_SORT, QUAKE_COLS } from "./quakes-utils";
import { useEffect, useMemo, useState } from "react";
import { ColumnOptions, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, GridOptions, LockMode, ServerInfo, createFilterBehavior } from "@ezgrid/grid-core";
import axios from "axios";

export const QuakesDg = () => {
    const [request, setRequest] = useState<FilterPageSortArguments<EarthquakeData>>();
    const [response, setResponse] = useState<ServerInfo<EarthquakeData>>({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setRequest({
            distinctValueColumns: DISTINCT_COLS,
            visibleColumns: QUAKE_COLS,
            sorts: INITIAL_SORT,
            reason: FilterPageSortChangeReason.InitialLoad,
        });
    }, [QUAKE_COLS, DISTINCT_COLS,INITIAL_SORT]);
    useEffect(() => {
        if (!request) return;
        const getServerInfo = async (request: FilterPageSortArguments<EarthquakeData>) => {
            setLoading(true);
            request.visibleColumns = QUAKE_COLS;
            const newResp =(await axios.post<ServerInfo<EarthquakeData>>("/api/data", request)).data;
            setResponse(r=> ({...r, ...newResp}));
            setLoading(false);
        };
        getServerInfo(request);
    }, [request]);

    const gridOptions = useMemo<GridOptions<EarthquakeData>>(() => {
        const groupCols = request?.groupFields?.map(c=>QUAKE_COLS.find(col=>col.uniqueIdentifier === c.uniqueIdentifier)).filter(c=>c).map
            (c=>({...c,lockMode: LockMode.Left} as ColumnOptions<EarthquakeData>)) ||[];
        const nonGroupCols = groupCols.length>0?QUAKE_COLS.filter(c=>!groupCols.find(gc=>gc.uniqueIdentifier === c.uniqueIdentifier)).map
            (c=>({...c,headerText: c.footerOptions?.footerOperation ? `${c.headerText} (${c.footerOptions.footerOperation})` : c.headerText})):QUAKE_COLS;
        const opts: GridOptions<EarthquakeData> = {
            columns: [...groupCols, ...nonGroupCols],
            dataProvider: response.currentPageData,
            filterPageSortMode: FilterPageSortLoadMode.Server,
            enablePaging: groupCols.length === 0,
            serverInfo: response,
            behaviors: [createFilterBehavior({})],
            toolbarOptions: {
                enableGroupingDropzone: true,
                enableExpander:false,
            },
            groupingOptions:{
                enabled:true
            },
            sortOptions: {
                initialSort: INITIAL_SORT
            },
            eventBus: {
                onFilterPageSortChanged: (args, reason: FilterPageSortChangeReason) => {
                    setRequest({
                        ...args,
                        reason
                    });
                },
            },
            isLoading: loading,
            uniqueIdentifierOptions: {
                useField: groupCols.length === 0 ? "id" : groupCols[0].dataField,
            }
        };
        return opts
    }, [response, loading, request]);
    return <ReactDataGrid gridOptions={gridOptions} style={{ height: "100%", }} />
}