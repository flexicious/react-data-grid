import { EditorProps, EditStartMode, getApi, getFormattedValue, getRowColFromNode, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { FunctionComponent, useRef } from "react";
import { createDateField } from "../adapter";
import { createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const DateEditor: FunctionComponent<EditorProps> = ({ node,rowsToEdit }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const col = node.columnPosition?.column;
    const dateVal = rowsToEdit && rowsToEdit.length > 0 ? undefined : (api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? resolveExpression(node.rowPosition?.data, col?.dataField!));
    return createEditor(createDateField(node.gridOptions, {
        value: (dateVal), ref: inputRef, onChange: (newVal) => {
            if (newVal && !isNaN(newVal.getTime()) && col)
                applyEditedValue(node, getFormattedValue(newVal,col), rowsToEdit, true);
        }
    }), inputRef, rowIdentifier);
};

export const createDateEditorOptions = <T=unknown>(editStartMode= EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: DateEditor as FunctionComponent<RendererProps<T>>,
    editStartMode,
});