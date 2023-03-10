import { createColumn, FilterOperation, FilterPageSortArguments, FilterPageSortChangeReason, FilterPageSortLoadMode, ServerInfo } from "@euxdt/grid-core";
import { createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions } from "@euxdt/grid-react";
import { useEffect, useMemo, useState } from "react";
import { client } from "../graphql/client/apollo-client";
import { BusinessQuery } from "../graphql/client/queries/business";
import { DataGrid } from "./DataGrid";


export const RestaurantsDataGrid = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [request, setRequest] = useState<FilterPageSortArguments>();
    const [response, setResponse] = useState<ServerInfo>({});

    const uniqueIdentifierOptions = useMemo(() => ({
        useField: "business_id",
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
            const response = await client.query({
                query: BusinessQuery,
                variables: {
                    args: filterPageSortArgs,
                },
            })
            const result = response.data.businesses;
            const newResponse = {...result};
            setResponse(s=>{
                //Merge the new response with the old response.
                if (Object.keys(result.filterDistinctValues || {}).length > 0) {
                    newResponse.filterDistinctValues = { ...s.filterDistinctValues, ...result.filterDistinctValues };
                } else {
                    delete newResponse.filterDistinctValues;
                }
                return {
                    ...s,
                    ...newResponse,
                    pagination: {
                        ...s.pagination,
                        ...newResponse.pagination,
                    },
                };
            });
            setLoading(false);
        };
        getServerData(request);
    }, [request]);


    return (
        <DataGrid style={{height:"100%", }}
        gridOptions={{
            dataProvider: response?.currentPageData,
            filterPageSortMode: FilterPageSortLoadMode.Server,
            enablePaging: true,
            serverInfo: response,
            toolbarOptions: {
                enableGlobalSearch: false,
                enableExcel:true,
                enablePdf:true,
            },
            eventBus: {
                onFilterPageSortChanged: (args: FilterPageSortArguments, reason: FilterPageSortChangeReason) => {
                    setRequest({
                        ...args,
                        reason,
                        distinctValueColumns: [],//don't need distinct values on subsequent calls
                    });
                },
                onExportPageRequested: async(args) => {
                    const response = await client.query({
                        query: BusinessQuery,
                        variables: {
                            args,
                        },
                    });
                    return response.data.businesses.currentPageData;
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
        }} />
    );
};