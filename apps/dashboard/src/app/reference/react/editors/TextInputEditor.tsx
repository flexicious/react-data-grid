import { EditorProps, EditStartMode, getApi, getRowColFromNode, itemToLabel, RendererProps, stopPrevent } from "@euxdt/grid-core";
import { FunctionComponent, useRef, KeyboardEvent, useEffect, useState } from "react";
import { createTextField } from "../adapter";
import { createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const TextInputEditor: FunctionComponent<EditorProps> = ({ node, rowsToEdit }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userValue, setUserValue] = useState<string | undefined>(undefined);
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const defaultValue =rowsToEdit && rowsToEdit.length?"": api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? itemToLabel(node.rowPosition?.data, node.columnPosition?.column!);
    useEffect(() => {
        setUserValue(undefined);
    }, [defaultValue,rowIdentifier,columnIdentifier]);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const col = node.columnPosition?.column;
        if (!api.keyStrokeValid(e.nativeEvent, col)) {
            stopPrevent(e);
        }
        else if(e.key === "Enter" || e.key === "Tab") {
            applyEditedValue(node, inputRef.current ? inputRef.current.value : userValue, rowsToEdit);
        }
    };
    return createEditor(createTextField(node.gridOptions, {
        onChange: (newVal) => {
            setUserValue(newVal);
        }, value: userValue ?? String(defaultValue), ref: inputRef, onKeyDown: handleKeyDown
    }), inputRef, rowIdentifier);
};


export const createTextInputEditorOptions = (editStartMode= EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: TextInputEditor,
    editStartMode,
});