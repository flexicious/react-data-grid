import { debounce, FilterOperation, FilterOptions, getApi, RendererProps, GRID_CONSTANTS, camelCaseToSpace } from "@ezgrid/grid-core";
import { FC, useEffect, useRef } from "react";
import { createTextField } from "../adapter";

const TextInputFilter: FC<RendererProps> = ({ node }) => {
    const textInputRef = useRef<HTMLInputElement>(null);
    const api = getApi(node);
    const col = node.columnPosition?.column;
    const opts = col?.filterOptions;
    const columnIdentifier = col?.uniqueIdentifier!;
    const debouncedChange = debounce((newVal:string) => {
        api.setFilterValue(columnIdentifier, newVal);
    }, opts?.delayedChangeDuration || GRID_CONSTANTS.TEXT_INPUT_CHANGE_DELAY);
    let currentValue = "";
    if (col?.uniqueIdentifier) {
        currentValue = api.getFilterValue(columnIdentifier) as string || "";
    }
    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.value = currentValue;
        }
    }, [currentValue]);
    return createTextField(node.gridOptions, {
        type: "text", placeholder: opts?.filterWaterMark || "Search...", onChange: debouncedChange, ref: textInputRef,
        style: { width: "100%" }
    });
};

export const TextInputFilterRenderer = (props: RendererProps) => <TextInputFilter key={props.node.key} {...props} />;

export const createTextInputFilterOptions = <T=unknown>(filterOperation: FilterOperation): FilterOptions<T> => {
    return {
        filterRenderer: TextInputFilterRenderer as FC<RendererProps<T>>,
        filterWaterMark: filterOperation=== FilterOperation.Wildcard? "*Search*": camelCaseToSpace(filterOperation),
        filterOperation
    };
};