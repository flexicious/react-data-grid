import { Behaviors, debounce, getApi, GridIconButton, isCtrlOrMeta, RendererProps, stopPrevent, GRID_CONSTANTS } from "@ezgrid/grid-core";
import { useEffect, useRef, FC, KeyboardEvent } from "react";
import { createTextField } from "../adapter";
import { buttonCreator } from "../shared";
export const ToolbarRight: FC<RendererProps> = ({ node }) => {

    const textInputGlobalSearch = useRef<HTMLInputElement>(null);
    const textInputFind = useRef<HTMLInputElement>(null);
    const context = node.gridOptions.contextInfo;
    const options = node.gridOptions.toolbarOptions;
    const calcs = context?.modifications;
    const quickFind = context?.quickFind;
    const api = getApi(node);
    const hasFilterBehavior = api?.hasBehavior(Behaviors.FilterBehavior);
    let globalFilter = "";
    let quickFindValue = "";
    if (calcs) {
        globalFilter = calcs?.globalFilterValue || "";
        quickFindValue = calcs?.quickFindValue || "";
    }
    const debouncedGlobalFilterChange = debounce(() => {
        api!.setGlobalFilter(textInputGlobalSearch.current?.value || "");
    }, node.gridOptions?.toolbarOptions?.changeDelay || GRID_CONSTANTS.TEXT_INPUT_CHANGE_DELAY);

    const clearQuickFind = () => {
        if (textInputFind.current) {
            textInputFind.current.value = "";
            api!.setQuickFindValue(textInputFind.current?.value || "", true);
        }
    };
    const handleOnFindKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            api!.setQuickFindValue(textInputFind.current?.value || "", !isCtrlOrMeta(event));
            stopPrevent(event);
        }
    };
    useEffect(() => {
        if (textInputGlobalSearch.current) {
            textInputGlobalSearch.current.value = globalFilter;
        }
    }, [globalFilter]);
    useEffect(() => {
        if (textInputFind.current) {
            textInputFind.current.value = quickFindValue;
        }
    }, [quickFindValue]);

    return <div className="ezgrid-dg-toolbar-section">
        <><>{node.gridOptions.toolbarOptions?.rightToolbarRenderer && node.gridOptions.toolbarOptions.rightToolbarRenderer({ node })}</></>
        {options?.enableGlobalSearch !== false && hasFilterBehavior
            && createTextField(node.gridOptions, {
                type: "text", placeholder: "Filter...", onKeyDown: debouncedGlobalFilterChange, ref: textInputGlobalSearch, style: { width: "150px" }
            })}
        {options?.enableQuickFind !== false && createTextField(node.gridOptions, {
            type: "text", placeholder: "Find...", onKeyDown: handleOnFindKeyDown, ref: textInputFind, style: { width: "150px" }
        })}
        {quickFind && (
            quickFind?.matches.length === 0 ? <>No matches. {(context.expansion?.maxExpandLevel || 0) > (context.expansion?.expandedToLevel || 0) ? "Try Expanding the rows" : ""}</> :
                <span > {quickFind?.currentMatchIndex + 1} of {quickFind?.matches.length}</span>)}
        {quickFind && buttonCreator(node, "close-icon", "Clear Quick Find", clearQuickFind, GridIconButton.Cancel)}
    </div>;
};
