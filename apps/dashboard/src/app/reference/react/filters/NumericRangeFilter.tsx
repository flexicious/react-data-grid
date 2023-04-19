import { GRID_CONSTANTS, debounce, FilterOperation, FilterOptions, getApi, RangeFilter, RangeFilterRendererProps, RendererProps } from "@euxdt/grid-core";
import { FC, useEffect, useRef } from "react";
import { createTextField } from "../adapter";

export const NumericRangeFilter: FC<RangeFilterRendererProps> = ({ node, filterBuilderMode, onValueChanged, value, numeric }) => {
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);
    const api = getApi(node);
    const col = node.columnPosition?.column;
    const columnIdentifier = col?.uniqueIdentifier!;
    const debouncedChange = debounce(() => {
        let value: RangeFilter | undefined = undefined;
        if (startRef.current?.value && endRef.current?.value) {
            value = {
                start: numeric === false ? startRef.current?.value : Number(startRef.current?.value),
                end: numeric === false ? endRef.current?.value : Number(endRef.current?.value)
            };
        } else if (startRef.current?.value === "" && endRef.current?.value === "") {
            if (!filterBuilderMode)
                api.clearFilterValue(columnIdentifier);
        }
        if (value) {
            if (!filterBuilderMode)
                api.setFilterValue(columnIdentifier, value);
            else
                onValueChanged?.(value);
        }
    }, col?.filterOptions?.delayedChangeDuration || GRID_CONSTANTS.TEXT_INPUT_CHANGE_DELAY);
    let currentValue: RangeFilter | undefined = undefined;
    if (columnIdentifier) {
        currentValue = (filterBuilderMode ? value : api.getFilterValue(columnIdentifier)) as RangeFilter | undefined;
    }
    useEffect(() => {
        if (startRef.current && endRef.current) {
            if (currentValue?.start && currentValue?.end) {
                startRef.current.value = (currentValue.start || "").toString();
                endRef.current.value = (currentValue.end || "").toString();
            } else {
                startRef.current.value = "";
                endRef.current.value = "";
            }
        }
    }, [currentValue?.start, currentValue?.end]);
    return <div className={`${GRID_CONSTANTS.CSS_PREFIX}numeric-range`} >
        {
            createTextField(node.gridOptions, { ref: startRef, type: "number", onChange: debouncedChange, placeholder: ">=" })
        }
        <div style={{ width: "5px" }}></div>
        {
            createTextField(node.gridOptions, { ref: endRef, type: "number", onChange: debouncedChange, placeholder: "<=" })
        }
    </div>;
};
const NumericRangeFilterRenderer = (props: RendererProps) => <NumericRangeFilter key={props.node.key} {...props} />;
export const createNumericRangeFilterOptions = (): FilterOptions => {
    return {
        filterRenderer: NumericRangeFilterRenderer,
        filterOperation: FilterOperation.Between,
    };
};