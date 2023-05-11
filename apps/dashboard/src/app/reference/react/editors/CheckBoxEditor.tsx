import { EditorProps, EditStartMode, getApi, getRowColFromNode, GridIconButton, parseBoolean, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { FunctionComponent, useRef, useState } from "react";
import { createCheckBox } from "../adapter";
import { buttonCreator, createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const CheckBoxEditor: FunctionComponent<EditorProps> = ({ node, rowsToEdit }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const isBulkEdit = rowsToEdit && rowsToEdit.length > 0;
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const val = isBulkEdit ? undefined :(api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? resolveExpression(node.rowPosition?.data, node.columnPosition?.column.dataField!));
    const checked = val;
    const handleChange = (newVal: boolean) => {
        if(isBulkEdit){
            setIsCheck(newVal);
        } else
        applyEditedValue(node, newVal, rowsToEdit, true);
    };
    const applyBulkEdit = () => {
        applyEditedValue(node, isCheck, rowsToEdit, true); 
    }
    return <div className="ezgrid-dg-toolbar-section" >
    {
        createEditor(createCheckBox(node.gridOptions, { ref: inputRef, onChange: handleChange, value:isBulkEdit?isCheck:parseBoolean(checked?.toString()) }), inputRef, rowIdentifier, {
            display: "flex",
            justifyContent: "center",
        })
    }
    {
        isBulkEdit && buttonCreator(node, "check-icon", "Apply Filter", applyBulkEdit, GridIconButton.Apply, false)

    }
    </div>;
};
export const createCheckBoxEditorOptions = <T=unknown>(editStartMode= EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: CheckBoxEditor as FunctionComponent<RendererProps<T>>,
    editStartMode,
});