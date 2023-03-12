import {  GRID_CONSTANTS, RendererProps } from "@euxdt/grid-core";
import { ToolbarLeft } from "./ToolbarLeft";
import { ToolbarRight } from "./ToolbarRight";
import { FC,useRef } from "react";

const Toolbar: FC<RendererProps> = ({ node }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const { box, styles } = node;
    return <div ref={divRef} className={`${node.classNames} ${GRID_CONSTANTS.CSS_PREFIX}toolbar ${node.gridOptions.isLoading ? GRID_CONSTANTS.CSS_PREFIX + "disabled" : ""}`} 
        style={{ ...styles, ...box, overflowX:"auto", overflowY:"hidden" }} >
            <div style={{ paddingLeft: "5px" }} >
            <ToolbarLeft node={node} />
        </div>
        <div style={{ paddingRight: "5px" }}>
            <ToolbarRight node={node} />
        </div>
    </div >;
};

export const ToolbarRenderer = (props: RendererProps) => <Toolbar key={props.node.key} {...props} />;