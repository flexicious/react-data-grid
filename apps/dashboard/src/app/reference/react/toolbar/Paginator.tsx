import { GRID_CONSTANTS, getApi, getCurrentPageSize, GridIconButton, RendererProps } from "@ezgrid/grid-core";
import { createSelectField } from "../adapter";
import { buttonCreator } from "../shared";
import { FC, useEffect, useState } from "react";

export const Paginator: FC<RendererProps> = ({ node }) => {
    const pagination = node.gridOptions.contextInfo?.pagination;
    const api = getApi(node);
    const options = node.gridOptions.paginationOptions;
    const [itemCount, setItemCount] = useState(0);
    useEffect(() => {
        setItemCount(api.getFilteredDataFlat().length);
    }, [node.gridOptions.contextInfo?.filteredDataProvider?.length]);
    const pageSize = api.getPageSize();
    if (pagination) {
        const totalPages = Math.ceil(pagination.totalRecords / pageSize);
        return <div className="ezgrid-dg-toolbar-section" > | 
            {buttonCreator(node, "page-first-icon", "Go to first page", () => api.pageOperation("first"), GridIconButton.PageFirst, pagination?.currentPage === 1)}
            {buttonCreator(node, "page-prev-icon", "Go to previous page", () => api.pageOperation("previous"), GridIconButton.PagePrevious, pagination?.currentPage === 1)}
            {buttonCreator(node, "page-next-icon", "Go to next page", () => api.pageOperation("next"), GridIconButton.PageNext, pagination?.currentPage === totalPages)}
            {buttonCreator(node, "page-last-icon", "Go to last page", () => api.pageOperation("last"), GridIconButton.PageLast, pagination?.currentPage === totalPages)}
            {
                options?.enablePageSizeSelector !== false && <>Items:
                    {createSelectField(node.gridOptions, {
                        fullWidth: false,
                        onChange: (e) => api.setPageSize(parseInt(e.toString())),
                        value: pageSize.toString(),
                        options: (options?.pageSizeOptions || GRID_CONSTANTS.DEFAULT_PAGE_SIZE_OPTIONS).map((size) => ({ value: size.toString(), name: size.toString() }))
                    })}

                </>
            }
            <div style={{whiteSpace:"nowrap"}}>
            {(((pagination.currentPage - 1) * pageSize) + 1).toFixed()} to {Math.min(pagination.totalRecords, (pagination.currentPage) * pageSize).toFixed()} of {pagination.totalRecords}
            </div>


        </div>;
    } else {
        return <div className="ezgrid-dg-toolbar-section" style={{whiteSpace:"nowrap"}}> |
            <div>{itemCount} item(s)</div>
        </div>;
    }
};
