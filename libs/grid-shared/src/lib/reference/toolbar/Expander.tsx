import { FilterPageSortLoadMode, getApi, gridCSSPrefix, GridIconButton, isHierarchyEnabled, RendererProps } from "@ezgrid/grid-core";
import { FC } from "react";
import { buttonCreator } from "../shared/shared-props";

export const Expander: FC<RendererProps> = ({ node }) => {
    const enableExpandCollapse = isHierarchyEnabled(node.gridOptions);
    if (enableExpandCollapse) {
        const api = getApi(node);
        return <div className={gridCSSPrefix("toolbar-section")}>|
            {node.gridOptions.nextLevel?.itemLoadMode === FilterPageSortLoadMode.Server?
            buttonCreator(node, "collapse-all-icon", "Expand All", api.collapseAll, GridIconButton.CollapseAll)
            : buttonCreator(node, "expand-all-icon", "Expand All", api.expandCollapseAll, GridIconButton.ExpandAll)}
        </div>;
    }
    return <></>;
};
