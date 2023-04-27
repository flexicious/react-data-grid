import { getApi, GridIconButton, RendererProps } from "@ezgrid/grid-core";
import { buttonCreator } from "../shared/shared-props";
import { FC } from "react";

export const Selection: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const selectedRows = node.gridOptions.contextInfo?.modifications?.selectedRowIds;
    const selectedCells = node.gridOptions.contextInfo?.modifications?.selectedCells;
    const selectionCount = (selectedRows?.length || 0) + (selectedCells?.length || 0);
    const clearSelection = () => {
        api.clearSelection();
    };
    return <>
        {selectionCount > 0 && <div className="ezgrid-dg-toolbar-section" style={{whiteSpace:"nowrap"}}>| {selectionCount} selected
            {buttonCreator(node, "close-icon", "Clear Selection", clearSelection, GridIconButton.Cancel)}
        </div>}
    </>;
};
