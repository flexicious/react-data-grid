import { getApi, getRowColFromNode, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { FunctionComponent, useRef } from "react";
import { createCheckBox } from "../adapter";
import { createEditor } from "../shared/shared-props";

export const CheckBoxEditor: FunctionComponent<RendererProps> = ({ node }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const val = (api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? resolveExpression(node.rowPosition?.data, node.columnPosition?.column.dataField!));
    const checked = val;
    const handleChange = (newVal: boolean) => {
        api.addChange(node.rowPosition!, node.columnPosition!, newVal);
    };
    return createEditor(createCheckBox(node.gridOptions, { ref: inputRef, onChange: handleChange, value: checked }), inputRef, rowIdentifier, {
        display: "flex",
        justifyContent: "center",
    });
};