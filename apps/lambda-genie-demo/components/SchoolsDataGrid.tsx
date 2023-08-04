
import { ColumnOptions, createEditBehavior, createFilterBehavior, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, GridOptions, GridSelectionMode, nullifyParent, resolveExpression, ServerInfo } from "@ezgrid/grid-core";
import { ChartBuilder, createMultiSelectFilterOptions, FilterBuilder, FormulaColumnEditor, getFilterOptions, ReactDataGrid } from "@ezgrid/grid-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { GridConfig } from "../shared/lambda-genie/config-bindings";
import { createPdfBehavior, createExcelBehavior } from "@ezgrid/grid-export";
import { muiNodePropsFunction } from "@ezgrid/grid-adapter-mui";
import { rechartsAdapter } from "@ezgrid/grid-adapter-recharts";
import { useTheme } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { muiAdapter } from "@ezgrid/grid-adapter-mui";
import React from "react";
import { GridDateInputElementProps } from "@ezgrid/grid-core";

export const getMuiAdapter = () => muiAdapter(
    {
        createDateField: ({value, onChange}:GridDateInputElementProps) => <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                onChange={(newValue) => {
                    const oDate = resolveExpression(newValue, "$d");
                    onChange?.(oDate || newValue);
                }}
                renderInput={(params) => <TextField autoFocus {...params} variant="standard" />}
            />
        </LocalizationProvider>
    }
)
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
    const uniqueIdentifierOptions = useMemo(() => ({
        useField: "schools.CDSCode",
    }), []);
    const initialLoadDistinctValueColumns = useMemo(() => [], []);//Which distinct values preload, and which are loaded on demand.
    const visibleColumns = useMemo(() => (gridColumnConfig || []).filter((c) => !c.hidden).map((c) => c), [gridColumnConfig]);
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
            pagination: { pageSize: 50, currentPage: 1 },
            visibleColumns,
            reason: FilterPageSortChangeReason.InitialLoad,
        });
    }, [initialLoadDistinctValueColumns, visibleColumns]);
    const theme = useTheme();
    useEffect(() => {
        //When the request (filter, page, sort, filter distinct value request) changes, get the data from the server.
        if (!request) return;
        const getServerInfo = async (request: FilterPageSortArguments) => {
            if (request.reason !== FilterPageSortChangeReason.FilterDistinctValuesRequested)
                setLoading(true);
            nullifyParent(request.visibleColumns)
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
    const gridOptions = useMemo<GridOptions>(() => ({
        dataProvider: response?.currentPageData,
        filterPageSortMode: FilterPageSortLoadMode.Server,
        enablePaging: true,
        selectionMode: GridSelectionMode.MultipleCells,
        
        serverInfo: response,
        toolbarOptions: {
            filterBuilderRenderer: ({ node }) => <FilterBuilder node={node} />,
            chartBuilderRenderer: ({ node }) => <ChartBuilder node={node} />,
            addFormulaColumnRenderer: ({ node }) => <FormulaColumnEditor node={node} />,
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

        behaviors: [createFilterBehavior({}),
        createPdfBehavior({}),
        createExcelBehavior({}),
        createEditBehavior({})
        ],
        chartLibraryAdapter: rechartsAdapter({}),
        adapter:getMuiAdapter(),
        nodePropsFunction:muiNodePropsFunction(theme),

        eventBus: {
            onFilterDistinctValuesRequested: (col: ColumnOptions) => {
                setRequest({
                    ...request,
                    distinctValueColumns: [col],
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
                nullifyParent(args.visibleColumns);
                const result = await axios.post<ServerInfo>("/api/schools", args);
                return result.data.currentPageData || [];
            },
        },
        isLoading: loading,
        uniqueIdentifierOptions,
        columns: cols,

        ...gridConfig,
    }), [response, theme, loading, uniqueIdentifierOptions, cols, gridConfig, request]);
    return (<ReactDataGrid style={{ height: "100%", }}
        gridOptions={gridOptions} />
    );
};