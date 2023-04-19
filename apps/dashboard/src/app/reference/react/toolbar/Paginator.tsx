import { GRID_CONSTANTS, getApi, getCurrentPageSize, GridIconButton, RendererProps } from "@euxdt/grid-core";
import { createSelectField } from "../adapter";
import { buttonCreator } from "../shared";
import { FC } from "react";

export const Paginator: FC<RendererProps> = ({ node }) => {
    const pagination = node.gridOptions.contextInfo?.pagination;
    const api = getApi(node);
    const options = node.gridOptions.paginationOptions;
    if (pagination) {
        return <div className="euxdt-dg-toolbar-section" > | 
            {buttonCreator(node, "page-first-icon", "Go to first page", () => api.pageOperation("first"), GridIconButton.PageFirst, pagination?.currentPage === 1)}
            {buttonCreator(node, "page-prev-icon", "Go to previous page", () => api.pageOperation("previous"), GridIconButton.PagePrevious, pagination?.currentPage === 1)}
            {buttonCreator(node, "page-next-icon", "Go to next page", () => api.pageOperation("next"), GridIconButton.PageNext, pagination?.currentPage === pagination?.totalPages)}
            {buttonCreator(node, "page-last-icon", "Go to last page", () => api.pageOperation("last"), GridIconButton.PageLast, pagination?.currentPage === pagination?.totalPages)}
            {
                options?.enablePageSizeSelector !== false && <>Items:
                    {createSelectField(node.gridOptions, {
                        fullWidth: false,
                        onChange: (e) => node.gridOptions.contextInfo?.gridApi.pageOperation("pageSizeChanged", parseInt(e.toString())),
                        value: getCurrentPageSize(node.gridOptions).toString(),
                        options: (options?.pageSizeOptions || GRID_CONSTANTS.DEFAULT_PAGE_SIZE_OPTIONS).map((size) => ({ value: size.toString(), name: size.toString() }))
                    })}

                </>
            }
            <div style={{whiteSpace:"nowrap"}}>
            {(((pagination.currentPage - 1) * pagination.pageSize) + 1).toFixed()} to {Math.min(pagination.totalRecords, (pagination.currentPage) * pagination.pageSize).toFixed()} of {pagination.totalRecords}
            </div>


        </div>;
    } else {
        return <div className="euxdt-dg-toolbar-section" style={{whiteSpace:"nowrap"}}> |
            <div>{node.gridOptions.contextInfo?.filteredDataProvider?.length} item(s)</div>
        </div>;
    }
};
