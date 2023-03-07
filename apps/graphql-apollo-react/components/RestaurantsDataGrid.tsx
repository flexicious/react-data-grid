import { createColumn, FilterOperation, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, ServerInfo } from "@euxdt/grid-core";
import { createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions } from "@euxdt/grid-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import { client } from "../graphql/client/apollo-client";
import { BusinessQuery } from "../graphql/client/queries/business";
import { DataGrid } from "./DataGrid";


export const RestaurantsDataGrid = () => {
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
            const response = await client.query({
                query: BusinessQuery,
                variables: {
                    args: filterPageSortArgs,
                },
            });
            const newServerInfo: ServerInfo = {
                currentPageData: response.data.businesses.rows,
                pagination: {
                    currentPage: pagination?.currentPage || 1,
                    pageSize: pagination?.pageSize || 100,
                    totalRecords: response.data.businesses.count || 0,
                    totalPages: Math.ceil(response.data.businesses.count / (pagination?.pageSize || 100)),
                },
            };
            if(Object.keys(response.data.businesses.filterDistinctValues || {}).length > 0) {
                newServerInfo.filterDistinctValues = response.data.businesses.filterDistinctValues;
            }
            if(Object.keys(response.data.businesses.footerValues || {}).length > 0) {
                newServerInfo.footerValues = response.data.businesses.footerValues;
            }
            dispatch({ type: "SET_SERVER_INFO", payload: newServerInfo });

            setLoading(false);
        };
        getServerData(filterPageSortArgs);
    }, [filterPageSortArgs]);


    return (
        <DataGrid style={{height:"100%", }}
        gridOptions={{
            dataProvider: serverInfo?.currentPageData,
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
                    const response = await client.query({
                        query: BusinessQuery,
                        variables: {
                            args,
                        },
                    });
                    return response.data.businesses.rows;
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