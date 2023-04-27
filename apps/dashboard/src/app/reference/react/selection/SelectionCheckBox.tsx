import { CheckBoxState, getApi, getUniqueRowIdentifier, RendererProps } from "@ezgrid/grid-core";
import { FC, useEffect } from "react";
import { TriStateCheckBox } from "../TriStateCheckBox";

const SelectionCheckBox: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const rowIdentifier = node.rowPosition?.uniqueIdentifier;
    const isRowSelectable = rowIdentifier && node.gridOptions.selectionOptions?.rowSelectableFunction ? node.gridOptions.selectionOptions?.rowSelectableFunction(rowIdentifier) : true;
    const onChange = (cb: CheckBoxState) => {
        const uniqueIdentifier = getUniqueRowIdentifier(node.rowPosition?.data, node.gridOptions, node.gridOptions.dataProvider?.indexOf(node.rowPosition?.data) || 0);
        const cell = { rowIdentifier: uniqueIdentifier!, columnIdentifier: node.columnPosition?.column.uniqueIdentifier! };
        if (cb === CheckBoxState.CHECKED) {
            api!.selectRow(cell);
        } else {
            api!.deselectRow(cell);
        }
    };

    const getCheckedState = () => {
        const calcs = node.gridOptions.contextInfo?.modifications;
        const selection = calcs?.selectedRowIds;
        if (selection) {
            const uniqueIdentifier = getUniqueRowIdentifier(node.rowPosition?.data, node.gridOptions);
            if (selection.length === 0) {
                return (CheckBoxState.UNCHECKED);
            } else if (selection.indexOf(uniqueIdentifier!) === -1) {
                return (CheckBoxState.UNCHECKED);
            } else if (api?.areRowsSelected([node.rowPosition?.data], (node.rowPosition?.level || 1) + 1)) {
                return (CheckBoxState.CHECKED);
            } else {
                return (CheckBoxState.INDETERMINATE);
            }
        }
        return (CheckBoxState.UNCHECKED);
    };

    return isRowSelectable ? <TriStateCheckBox key={node.rowPosition?.uniqueIdentifier} node={node} onChange={onChange} value={getCheckedState()} allowIndeterminate={false} /> : <></>;

};

export const SelectionCheckBoxRenderer = (props: RendererProps) => <SelectionCheckBox key={props.node.key} {...props} />;