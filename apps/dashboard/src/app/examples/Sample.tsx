import { createColumn, createEditBehavior, createFilterBehavior, FilterOperation, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, FooterOperation, NodeKeys, RowPositionInfo, RowType, ServerInfo, VirtualTreeNode } from "@ezgrid/grid-core";
import { createPdfBehavior, createExcelBehavior } from "@ezgrid/grid-export";
import { createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, EMPTY_COL_PROPS, ReactDataGrid } from "@ezgrid/grid-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export const Sample = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [childLoading, setChildLoading] = useState<boolean>(false);
    const [request, setRequest] = useState<FilterPageSortArguments>();
    const [response, setResponse] = useState<ServerInfo>({});
    const uniqueIdentifierOptions = useMemo(() => ({
        useFunction: (item:any)=> {
            const uniqueId = item.uniqueId || item.business_id;
            return uniqueId.toString();
        }
    }), []);
    const initialLoadDistinctValueColumns = useMemo(() => ["name", "city","TaxCode"], []);
    useEffect(() => {
        //Initial load
        setRequest({
            distinctValueColumns: initialLoadDistinctValueColumns,
            filter: { children: [] },
            pagination: { pageSize: 100, currentPage: 1 },
            reason: FilterPageSortChangeReason.InitialLoad,
        });
    }, [initialLoadDistinctValueColumns]);
    useEffect(() => {
        if (!request) return;
        const getServerData = async (filterPageSortArgs: FilterPageSortArguments) => {
            setLoading(true);
            const response = await axios.post<ServerInfo>("/api/businesses", request);
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
        getServerData(request);
    }, [request]);


    return (<>
        {childLoading && <div className="ezgrid-dg-loading-message">Loading...</div>}
        <ReactDataGrid style={{height:"100%", }}
        gridOptions={{
            cellStyleFunction: (node: VirtualTreeNode) => {
                if (node.rowPosition?.type === RowType.Header
                    || node.rowPosition?.type === RowType.Footer
                    || node.rowPosition?.type === RowType.Filter
                    || (node.classNames?.indexOf("group-header-cell") || 0) > 0) {
                    return { background: "#fafafa" };
                }
                return { borderRight: "none", };
            },
            nodeStyleFunction: (node: VirtualTreeNode) => {
                //toolbar is neither a row or a cell, so we need to style it separately
                if (node.key === NodeKeys.Toolbar) {
                    return { background: "#fafafa" };
                }
                return node.styles;
            },
            enableFloatingHeaderRows: true,


      behaviors: [createFilterBehavior({}),
        createPdfBehavior({}),
        createExcelBehavior({}),
        createEditBehavior({ applyEditsToDataProviderImmediately: true })
        ],
            dataProvider: response?.currentPageData,
            filterPageSortMode: FilterPageSortLoadMode.Server,
            enablePaging: true,
            serverInfo: response,
            toolbarOptions: {
                enableGlobalSearch: false,
                enableExcel:true,
                enablePdf:true,
            },
            nextLevel:{
                childrenCountField:"inspection_count",
                itemLoadMode: FilterPageSortLoadMode.Server,
                enableFooters: true,    
                columns:[
                    {...createColumn("paddingInspection","string", " "),...EMPTY_COL_PROPS, width:36},
                    {...createColumn("date","string", "Inspection Date"), enableHierarchy:true},
                    createColumn("type","string", "Inspection Type"),
                    {...createColumn("Score","number", "Score"), footerOptions:{footerLabel:"Avg:", footerOperation:FooterOperation.Avg}},
                    {...createColumn("violationCount","number", "Violation Count"), formatterPrecision: 0, footerOptions:{footerOperation:FooterOperation.Sum}},
                    createColumn("fillInspection","string", " "),
                ],
                nextLevel:{
                    childrenCountField:"violationCount",
                    itemLoadMode: FilterPageSortLoadMode.Server,
                    enableFooters: true,
                    columns:[
                        {...createColumn("paddingViolation","string", " "),...EMPTY_COL_PROPS, width:108,},
                        {...createColumn("ViolationTypeID","string", "Violation Type"), width: 150,footerOptions:{footerLabel:"Count:", footerOperation:FooterOperation.Count}},
                        {...createColumn("risk_category","string", "Risk Category"), width: 150},
                        createColumn("description","string", "Description"),
                    ],
                    
                },
            },
            eventBus: {
                onFilterPageSortChanged: (args: FilterPageSortArguments, reason: FilterPageSortChangeReason) => {
                    setRequest({
                        ...args,
                        reason,
                        distinctValueColumns: [],//don't need distinct values on subsequent calls
                    });
                },
                onItemLoadRequested: async(row: RowPositionInfo) => {
                    setChildLoading(true);
                    const children = row.level===1?(await axios.get(`/api/inspections?business_id=${row.uniqueIdentifier}`)).data.inspections :
                    (await axios.get(`/api/violations?inspection_id=${row.uniqueIdentifier}`)).data.violations;
                    setResponse(s=>{
                        return {
                            ...s,
                            childrenMap: {
                                ...s.childrenMap,
                                [row.uniqueIdentifier]: children,
                            } 
                        };
                    });
                    setChildLoading(false);
                },
                onExportPageRequested: async(args) => {
                    const response =  await axios.post<ServerInfo>("/api/businesses", args);
                    return response.data.currentPageData || [];
                },
            },
            isLoading: loading,
            uniqueIdentifierOptions,
            columns: [
                {
                    ...createColumn("name", "string", "Name"),
                    filterOptions: createMultiSelectFilterOptions(),
                    enableHierarchy:true,
                },
                {
                    ...createColumn("business_id", "number", "Business_id", "business_id"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Equals),
                    formatterPrecision: 0,
                    width: 100,
                    textAlign: "right"
                },
                {
                    ...createColumn("TaxCode", "string", "Tax Code"),
                    filterOptions: createMultiSelectFilterOptions()
                },
                {
                    ...createColumn("inspection_count", "number", "Inspection Count"),
                    width: 100,
                    footerOptions:{footerLabel: "Total: "},
                    formatterPrecision: 0,
                    textAlign: "right"
                },
                {
                    ...createColumn("violation_count", "number", "Violation Count"),
                    footerOptions:{footerLabel: "Total: "},
                    width: 100,
                    formatterPrecision: 0,
                    textAlign: "right"
                },
                {
                    ...createColumn("address", "string", "Address"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
                },
                {
                    ...createColumn("city", "string", "City"),
                    filterOptions: createMultiSelectFilterOptions()
                },
                {
                    ...createColumn("postal_code", "number", "Postal_code"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
                },
                {
                    ...createColumn("latitude", "number", "Latitude"),
                    filterOptions: createNumericRangeFilterOptions(),
                },
                {
                    ...createColumn("longitude", "number", "Longitude"),
                    filterOptions: createNumericRangeFilterOptions(),
                },
                {
                    ...createColumn("business_certificate", "number", "Business_certificate"),
                    filterOptions: createNumericRangeFilterOptions(),
                },
                {
                    ...createColumn("owner_name", "string", "Owner_name"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
                },
                {
                    ...createColumn("owner_address", "number", "Owner_address"),
                    filterOptions: createNumericRangeFilterOptions(),
                },
                {
                    ...createColumn("owner_city", "string", "Owner_city"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
                },
                {
                    ...createColumn("owner_state", "string", "Owner_state"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
                },
                {
                    ...createColumn("owner_zip", "number", "Owner_zip"),
                    filterOptions: createNumericRangeFilterOptions(),
                }
            ]
        }} /></>
    );
};