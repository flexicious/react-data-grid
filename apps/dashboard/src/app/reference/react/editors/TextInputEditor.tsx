import { EditorProps, EditStartMode, getApi, getFormattedValue, getRowColFromNode, itemToLabel, RendererProps, stopPrevent } from "@ezgrid/grid-core";
import { FunctionComponent, useRef, KeyboardEvent, useEffect, useState } from "react";
import { createTextField } from "../adapter";
import { createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const TextInputEditor: FunctionComponent<EditorProps> = ({ node, rowsToEdit }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userValue, setUserValue] = useState<string | undefined>(undefined);
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const defaultValue = rowsToEdit && rowsToEdit.length ? "" : api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? itemToLabel(node.rowPosition?.data, node.columnPosition?.column!);
    useEffect(() => {
        setUserValue(undefined);
    }, [defaultValue, rowIdentifier, columnIdentifier]);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const col = node.columnPosition?.column;
        if (!api.keyStrokeValid(e.nativeEvent, col)) {
            stopPrevent(e);
        } else if (e.key === "Enter" || e.key === "Tab") {
            commitValue();
        }
    };
    const commitValue = () => {
        const col = node.columnPosition?.column;
        if ((inputRef.current?.value|| userValue) != itemToLabel(node.rowPosition?.data, node.columnPosition?.column!)) {
            if (col) {
                applyEditedValue(node, getFormattedValue(inputRef.current?.value || "", col), rowsToEdit, true);
            }
        }
    }
    return createEditor(createTextField(node.gridOptions, {
        onBlur: ()=>{
            if (rowsToEdit && rowsToEdit.length) return;
            commitValue();
        },
        onChange: (newVal) => {
            setUserValue(newVal);
            if (rowsToEdit && rowsToEdit.length) return;
            if (newVal)
                applyEditedValue(node, newVal, rowsToEdit);
        }, value: userValue ?? String(defaultValue), ref: inputRef, onKeyDown: handleKeyDown, onFocus: (e)=>{e.target.select()}
    }), inputRef, rowIdentifier);
};


export const createTextInputEditorOptions =<T=unknown>(editStartMode = EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: TextInputEditor as FunctionComponent<RendererProps<T>>,
    editStartMode,
});