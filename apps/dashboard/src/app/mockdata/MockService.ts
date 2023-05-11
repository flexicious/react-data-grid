import { GRID_CONSTANTS, getFooterValue, isMatch, NameValue, PaginationRequest, resolveExpression, Filter, ServerFooterValue, ServerInfo, sortDataProvider, SortInfo, FilterExpression } from "@ezgrid/grid-core";
import FlexiciousMockGenerator from "./FlexiciousMockGenerator";
import Organization from "./Organization";

export const getPagedData = async (
    filter: Filter,
    globalFilter: string,
    pagination: PaginationRequest,
    sortVales?: SortInfo[],
    existingDistinctValues?: Record<string, NameValue[]>,
    columnsThatNeedDistinctValues?: string[],
    columnsThatNeedFooterValues?: ServerFooterValue[],
): Promise<ServerInfo> => {
    const { pageSize, currentPage } = pagination;
    const orgs = FlexiciousMockGenerator.instance().getAllLineItems();
    const filteredData = orgs.filter((item) => {
        let retVal = true;
        if (globalFilter) {
            retVal = Object.keys(item).some((key) => {
                const val = resolveExpression(item, key);
                return val && val.toString().toLowerCase().includes(globalFilter.toLowerCase());
            });
        }
        if (retVal && filter.children.length > 0) {
            for (let i = 0; i < filter.children.length; i++) {
                const filterExp = filter.children[i] as FilterExpression;
                const result = isMatch(item, filterExp.col, filterExp.expression);
                if (!result) {
                    retVal = false;
                    break;
                }
            }

        }
        return retVal;
    });
    const filterDistinctValues:Record<string, NameValue[]> = {};

    (columnsThatNeedDistinctValues || []).forEach((column) => {
        if (existingDistinctValues && existingDistinctValues[column]) {
            filterDistinctValues[column]=existingDistinctValues[column];
        }
        else {
            const allValues = orgs.map((item) => resolveExpression(item, column));
            const uniqueValues = [...new Set(allValues)];
            const values = uniqueValues.map(item => ({ name: item, value: item }));
            filterDistinctValues[column]=values;
        }
    });



    const ps = pageSize || GRID_CONSTANTS.DEFAULT_PAGE_SIZE;
    const sortedData = sortDataProvider(sortVales||[], filteredData);
    const start = ((currentPage || 1) - 1) * ps;
    const end = start + pageSize;
    const currentPageData = sortedData.slice(start, end);
    const footerValues:Record<string, string> = {};
    columnsThatNeedFooterValues?.forEach((serverFooterValue) => {
        footerValues[serverFooterValue.column]=( getFooterValue(
            {
                dataField: serverFooterValue.column,
                uniqueIdentifier: serverFooterValue.column,
                headerText: "",
                footerOptions: { ...serverFooterValue }
            }
            , filteredData)

        );
    });
    const serverInfo: ServerInfo = {
        currentPageData,
        pagination: {
            currentPage: currentPage,
            pageSize: ps,
            totalRecords: filteredData.length,
        },
        filterDistinctValues,
        footerValues,
        childrenMap: {},
        dataForExport: [],
    };
    await new Promise(resolve => setTimeout(resolve, 1000));

    return serverInfo;
};


export const getDealsForOrg = async (orgId: string): Promise<unknown[]> => {
    const allOrgs = FlexiciousMockGenerator.instance().getDeepOrgList();
    const org = allOrgs.find((item) => item.id === orgId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return org?.deals || [];
};

export const getOrganizations = async (): Promise<Organization[]> => {
    const orgs = FlexiciousMockGenerator.instance().getFlatOrgList();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return orgs;
};