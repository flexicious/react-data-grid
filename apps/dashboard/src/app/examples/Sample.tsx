import { createColumn, createFilterBehavior, FilterOperation, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, ServerInfo, ServerResponse } from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import { createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import axios from "axios";
import { useEffect, useMemo, useReducer, useState } from "react";

export const Sample = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [filterPageSortArgs, setFilterPageSortArgs] = useState<FilterPageSortArguments>();
    const [serverInfo, dispatch] = useReducer( (state: ServerInfo, action: { type: "SET_SERVER_INFO";
        payload: Partial<ServerInfo>;
      }): ServerInfo => {
        switch (action.type) {
          case "SET_SERVER_INFO":
            return { ...state, ...action.payload };
          default:
            return state;
        }
      }, {});

    const uniqueIdentifierOptions = useMemo(() => ({
        useField: "business_id",
    }), []);
    const filterValueColumns = useMemo(() => ["name", "city"], []);
    const footerValueColumns = useMemo(() => ["inspection_count", "violation_count"], []);
    useEffect(() => {
        setFilterPageSortArgs({
            distinctValueColumns: filterValueColumns,
            footerValueColumns,
            filter: { children: [] },
            pagination: { pageSize: 100, currentPage: 1 },
        });
    }, [filterValueColumns, footerValueColumns]);
    useEffect(() => {
        if (!filterPageSortArgs) return;
        const getServerData = async (filterPageSortArgs: FilterPageSortArguments) => {
            const { pagination } = filterPageSortArgs;
            setLoading(true);
            const response = await axios.post<ServerResponse<Business>>("/api/businesses", filterPageSortArgs);
            const newServerInfo: ServerInfo = {
                currentPageData: response.data.rows,
                pagination: {
                    currentPage: pagination?.currentPage || 1,
                    pageSize: pagination?.pageSize || 100,
                    totalRecords: response.data.count || 0,
                    totalPages: Math.ceil(response.data.count / (pagination?.pageSize || 100)),
                },
            };
            if(Object.keys(response.data.filterDistinctValues || {}).length > 0) {
                newServerInfo.filterDistinctValues = response.data.filterDistinctValues;
            }
            if(Object.keys(response.data.footerValues || {}).length > 0) {
                newServerInfo.footerValues = response.data.footerValues;
            }
            dispatch({ type: "SET_SERVER_INFO", payload: newServerInfo });

            setLoading(false);
        };
        getServerData(filterPageSortArgs);
    }, [filterPageSortArgs]);


    return (
        <ReactDataGrid style={{ height: "800px", width: "1000px" }} gridOptions={{
            dataProvider: serverInfo?.currentPageData,
            behaviors: [
                createFilterBehavior({}),
                createPdfBehavior({}),
                createExcelBehavior({}),
            ],
            filterPageSortMode: FilterPageSortLoadMode.Server,
            enablePaging: true,
            serverInfo,
            toolbarOptions: {
                enableGlobalSearch: false,
                enableExcel:true,
                enablePdf:true,
            },
            eventBus: {
                onFilterPageSortChanged: (args: FilterPageSortArguments, reason: FilterPageSortChangeReason) => {
                    setFilterPageSortArgs({
                        ...args,
                        distinctValueColumns: [],//don't need distinct values on subsequent calls, footers only need to be updated on filter change
                        footerValueColumns: reason === FilterPageSortChangeReason.FilterChanged ? footerValueColumns : [],
                    });
                },
                onExportPageRequested: async(args) => {
                    const response =  await axios.post<ServerResponse<Business>>("/api/businesses", args);
                    return response.data.rows;
                },
            },
            isLoading: loading,
            uniqueIdentifierOptions,
            columns: [
                {
                    ...createColumn("business_id", "number", "Business_id", "business_id"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Equals),
                    formatterPrecision: 0,
                    width: 100,
                    textAlign: "right"
                },
                {
                    ...createColumn("name", "string", "Name"),
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
                    ...createColumn("TaxCode", "string", "Tax Code"),
                    filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
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
        }} />
    );
};

export interface Business {
    business_id: number;
    name: string;
    address: string;
    city: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    phone_number: number;
    TaxCode: string;
    business_certificate: number;
    application_date: string;
    owner_name: string;
    owner_address: string;
    owner_city: string;
    owner_state: string;
    owner_zip: string;
}