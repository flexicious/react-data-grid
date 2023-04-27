import { EditorProps, EditStartMode, getApi, getRowColFromNode, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { FunctionComponent, useRef } from "react";
import { createDateField } from "../adapter";
import { createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const DateEditor: FunctionComponent<EditorProps> = ({ node,rowsToEdit }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const dateVal = rowsToEdit && rowsToEdit.length > 0 ? undefined : (api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? resolveExpression(node.rowPosition?.data, node.columnPosition?.column.dataField!));
    return createEditor(createDateField(node.gridOptions, {
        value: (dateVal), ref: inputRef, onChange: (newVal) => {
            if (newVal && !isNaN(newVal.getTime()))
                applyEditedValue(node, newVal, rowsToEdit);
        }
    }), inputRef, rowIdentifier);
};

export const createDateEditorOptions = (editStartMode= EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: DateEditor,
    editStartMode,
});