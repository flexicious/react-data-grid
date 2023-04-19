import { CheckBoxState, RendererProps } from "@euxdt/grid-core";
import { useEffect, useState, FC } from "react";
import { TriStateCheckBox } from "../TriStateCheckBox";

const SelectionCheckBoxHeader: FC<RendererProps> = ({ node }) => {
    const [value, setValue] = useState<CheckBoxState>(CheckBoxState.INDETERMINATE);
    const api = node.gridOptions.contextInfo?.gridApi;
    const onChange = (cb: CheckBoxState) => {
        if (cb === CheckBoxState.CHECKED) {
            api!.selectAll();
        } else {
            api!.clearSelection();
        }
    };
    const calcs = node.gridOptions.contextInfo?.modifications;
    const selection = calcs?.selectedRowIds;
    useEffect(() => {
        if (selection) {
            if (selection.length === 0) {
                setValue(CheckBoxState.UNCHECKED);
            } else if (api?.areAllRowsSelected()) {
                setValue(CheckBoxState.CHECKED);
            } else {
                setValue(CheckBoxState.INDETERMINATE);
            }
        }
    }, [calcs?.selectedRowIds.length, node.gridOptions.dataProvider]);
    return <TriStateCheckBox node={node} onChange={onChange} value={value} allowIndeterminate={false} />;

};

export const SelectionCheckBoxHeaderRenderer = (props: RendererProps) => <SelectionCheckBoxHeader key={props.node.key} {...props} />;