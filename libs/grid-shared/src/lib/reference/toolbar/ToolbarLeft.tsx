import { RendererProps } from "@euxdt/grid-core";
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

    return <div className="euxdt-dg-toolbar-section" >
        {options?.enableSettings !== false && <SettingsMenu node={node} />}
        {options?.enableExpander !== false && <Expander node={node} />}
        <Exporter node={node} />
        <EditMenu node={node} />
        {options?.filterBuilderRenderer && (options.filterBuilderRenderer({ node }) as ReactNode)}
        {options?.enableGroupingDropzone !== false && <Grouping node={node} />}
        {options?.enableFilterchips !== false && <FilterChips node={node} />}
        <Paginator node={node} />
        <Selection node={node} />
        <>{options?.leftToolbarRenderer && options.leftToolbarRenderer({ node })}</>
    </div>;
};
