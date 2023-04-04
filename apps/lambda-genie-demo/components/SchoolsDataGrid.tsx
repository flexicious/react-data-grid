
import { ColumnOptions, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, GridSelectionMode, resolveExpression, ServerInfo } from "@euxdt/grid-core";
import { createMultiSelectFilterOptions, FilterBuilder, getFilterOptions } from "@euxdt/grid-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "./DataGrid";
import { GridConfig } from "../shared/lambda-genie/config-bindings";
export const distinctValueColumns = [
    "schools.CDSCode",
    "schools.StatusType",
    "schools.County",
    "schools.City",
    "schools.FundingType",
    "schools.DOCType",
    "schools.SOCType",
    "schools.EdOpsName",
    "schools.EILName",
    "schools.Virtual",
    "schools.GSoffered",
    "schools.GSoffered",
    "frpm_new.AcademicYear",
    "frpm_new.CountyCode",
    "frpm_new.DistrictType",
    "frpm_new.SchoolType",
    "frpm_new.EducationalOptionType",
    "frpm_new.NSLPProvisionStatus",
    "frpm_new.CharterFundingType",
    "satscores.rtype",
  ];
export interface SchoolsDataGridProps {
    gridConfig?: GridConfig;
    gridColumnConfig?: ColumnOptions[];
}
export const SchoolsDataGrid = (props: SchoolsDataGridProps) => {
    const { gridConfig, gridColumnConfig } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [request, setRequest] = useState<FilterPageSortArguments>();
    const [response, setResponse] = useState<ServerInfo>({});
    const [chatGptQuery, setChatGptQuery] = useState<string>("");


    const uniqueIdentifierOptions = useMemo(() => ({
        useField: "schools.CDSCode",
    }), []);
    const initialLoadDistinctValueColumns = useMemo(() => [], []);//Which distinct values preload, and which are loaded on demand.
    const visibleColumns = useMemo(() => (gridColumnConfig || []).filter((c) => !c.hidden).map((c) => c.dataField), [gridColumnConfig]);
    const cols = useMemo(() => gridColumnConfig?.map(c => {
        if (typeof c.format === "string") {
            c.filterOptions = getFilterOptions({ type: c.format });
            if (distinctValueColumns.indexOf(c.dataField) > -1) {
                c.filterOptions = createMultiSelectFilterOptions();
            }
        }
        return c;
    }), [gridColumnConfig]);
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

    return (<DataGrid style={{ height: "100%", }}
        gridOptions={{
            dataProvider: response?.currentPageData,
            filterPageSortMode: FilterPageSortLoadMode.Server,
            enablePaging: true,
            selectionMode: GridSelectionMode.MultipleCells,
            serverInfo: response,
            toolbarOptions: {
                filterBuilderRenderer: ({ node }) => <FilterBuilder node={node} />,
                enableGlobalSearch: false,
                enableExcel: true,
                enablePdf: true,
            },
            cellStyleFunction: (node) => {
                const rowColor = resolveExpression(node.rowPosition?.data, "rowColor");
                const isPercentCol = node.columnPosition?.column?.dataField === "frpm_new.PercentEligibleFreeK12";
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
                onColumnDragEnd: (col: ColumnOptions) => {
                    setChatGptQuery(chatGptQuery + col.dataField);
                },
            },
            isLoading: loading,
            uniqueIdentifierOptions,
            columns: cols,
            ...gridConfig,
        }} />
    );
};