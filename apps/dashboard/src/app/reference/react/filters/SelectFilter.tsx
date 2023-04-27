import { LABELS, FilterOptions, getApi, NameValue, RendererProps } from "@ezgrid/grid-core";
import { FC } from "react";
import { createSelectField } from "../adapter";

const SelectFilter: FC<RendererProps> = ({ node }) => {
    const allValue = {
        name: LABELS.ALL_LABEL,
        value: LABELS.ALL_LABEL
    };
    const api = getApi(node);
    const col = node.columnPosition?.column;
    const options = col ? [allValue, ...api.getDistinctFilterValues(col)] : [allValue];
    const columnIdentifier = node.columnPosition?.column.uniqueIdentifier!;
    let currentValue = LABELS.ALL_LABEL;
    if (node.columnPosition?.column.uniqueIdentifier) {
        currentValue = api.getFilterValue(columnIdentifier) as string || LABELS.ALL_LABEL;
    }
    const changeHandler = (newVal: unknown) => {
        api.setFilterValue(columnIdentifier, newVal);
    };
    return createSelectField(node.gridOptions, {
        onChange: changeHandler,
        value: currentValue,
        fullWidth: true,
        options: options as NameValue[],
    });
};

const SelectFilterRenderer = (props: RendererProps) => <SelectFilter key={props.node.key} {...props} />;

export const createSelectFilterOptions = (): FilterOptions => {
    return {
        filterRenderer: SelectFilterRenderer,
        filterComboBoxBuildFromGrid: true,
    };
};