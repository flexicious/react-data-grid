import { LABELS, CheckBoxState, FilterOptions, getApi, RendererProps, FilterOperation, FilterComparisonType } from "@ezgrid/grid-core";
import { FC } from "react";
import { TriStateCheckBox } from "../TriStateCheckBox";
const TriStateCheckBoxFilter: FC<RendererProps> = ({ node }) => {
    let currentValue: CheckBoxState | undefined = undefined;
    const api = getApi(node);
    const columnIdentifier = node.columnPosition?.column.uniqueIdentifier!;
    if (columnIdentifier) {
        currentValue = api.getFilterValue(columnIdentifier) as CheckBoxState;
    }
    const checkBoxValue = currentValue === undefined ? CheckBoxState.INDETERMINATE : currentValue;
    const onChange = (cb: CheckBoxState) => {
        api.setFilterValue(columnIdentifier, cb === CheckBoxState.INDETERMINATE ? LABELS.ALL_LABEL : cb === CheckBoxState.CHECKED ? CheckBoxState.CHECKED : CheckBoxState.UNCHECKED);
    };
    return <TriStateCheckBox node={node} onChange={onChange} value={checkBoxValue} allowIndeterminate={true} />;
};
const TriStateCheckBoxFilterRenderer = (props: RendererProps) => <TriStateCheckBoxFilter key={props.node.key} {...props} />;
export const createTriStateCheckBoxFilterOptions = <T=unknown>(): FilterOptions<T> => {
    return {
        filterRenderer: TriStateCheckBoxFilterRenderer as FC<RendererProps<T>>,
        filterOperation: FilterOperation.Equals,
        filterComparisonType: FilterComparisonType.Boolean
    };
};