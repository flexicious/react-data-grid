import { getApi, GridSelectionMode, RendererProps } from "@ezgrid/grid-core";
import { EditMenu } from "./edit/EditMenuRenderer";
import { Expander } from "./Expander";
import { Exporter } from "./Exporter";
import { Paginator } from "./Paginator";
import { SettingsMenu } from "./settings/SettingsMenuRenderer";
import { Selection } from "./Selection";
import { Grouping } from "./Grouping";
import { FilterChips } from "./FilterChips";
import { ReactNode, FC } from "react";
export const ToolbarLeft: FC<RendererProps> = ({ node }) => {
    const options = node.gridOptions.toolbarOptions; 
    const isMultipleRows = node.gridOptions.selectionMode === GridSelectionMode.MultipleRows || !node.gridOptions.selectionMode;
    return <div className="ezgrid-dg-toolbar-section" >
        {options?.enableSettings !== false && <SettingsMenu node={node} />}
        {options?.enableExpander !== false && <Expander node={node} />}
        <Exporter node={node} />
        <EditMenu node={node} />
        {options?.filterBuilderRenderer && (options.filterBuilderRenderer({ node }) as ReactNode)}
        {options?.chartBuilderRenderer && (options.chartBuilderRenderer({ node }) as ReactNode)}
        {options?.enableGroupingDropzone !== false && <Grouping node={node} />}
        {options?.enableFilterchips !== false && <FilterChips node={node} />}
        {(options?.enableItemCount  !== false || node.gridOptions.enablePaging) && <Paginator node={node} />}
        {(options?.enableSelectionCount !== false && isMultipleRows ) && <Selection node={node} /> }
        <>{options?.leftToolbarRenderer && options.leftToolbarRenderer({ node })}</>
    </div>;
};
