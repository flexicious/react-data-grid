import { getApi, GridIconButton, RendererProps } from "@ezgrid/grid-core";
import { buttonCreator } from "../shared/shared-props";
import { FC } from "react";

export const Selection: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const mods = node.gridOptions.contextInfo?.modifications;
    const selectedRowCount = (mods?.selectedRowIds?.length || 0) ;
    const selectedCellCount = mods?.selectedCells?.length || 0;

    return <>
        {(selectedRowCount > 0 ||selectedCellCount > 0) && <div className="ezgrid-dg-toolbar-section" style={{whiteSpace:"nowrap"}}>| {(selectedCellCount||selectedRowCount)} selected
            {buttonCreator(node, "close-icon", "Clear Selection", api.clearSelection, GridIconButton.Cancel)}
        </div>}
    </>;
};
