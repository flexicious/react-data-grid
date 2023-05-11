import { Behaviors, getApi, gridCSSPrefix, GridIconButton, NameValue,  RendererProps } from "@ezgrid/grid-core";
import { buttonCreator } from "../shared/shared-props";
import { FC, MouseEvent } from "react";

export const Grouping: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const hasGrouping = node.gridOptions.groupingOptions?.enabled === true;
    const toolbarOptions = node.gridOptions.toolbarOptions;
    const pfx = gridCSSPrefix;
    const isDragging= ()=>document.getElementsByClassName("ezgrid-dg-resize-bar").length > 0;
    const addCls = (cls: string) => (e: MouseEvent<HTMLDivElement>) => isDragging() && e.currentTarget.classList.add(pfx(cls));
    const removeCls = (cls: string) => (e: MouseEvent<HTMLDivElement>) => e.currentTarget.classList.remove(pfx(cls));
    const groupingChips = (api.getGroupByFields()).map((nv: NameValue, index) => {
        return <div  className={pfx("toolbar-section")} key={index} onMouseOver={addCls("drop-right-cell")}
             onMouseOut={removeCls("drop-right-cell")} data-drop-index={index}>
            <span >{nv.name || nv.value || ""}</span>
            {buttonCreator(node, "close-icon", "Remove Grouping", () => api.removeGroupBy(nv.value),
                GridIconButton.Cancel)}
        </div>;
    }
    );
    return <div className={pfx("toolbar-section")} >
        {hasGrouping && toolbarOptions?.enableGroupingDropzone && <div className={pfx("toolbar-section")} >
            <div className={pfx(["toolbar-section","group-drop-zone"])}
            onMouseOver={addCls("group-drop-area")}
            onMouseOut={removeCls("group-drop-area")} >
            {
                groupingChips.length > 0 ? groupingChips : <span >Drop column here to group</span>
            }
        </div>
        </div>}
    </div>;
};
