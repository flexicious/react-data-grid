import { EditStartMode, getApi, getRowColFromNode, itemToLabel, RendererProps, stopPrevent } from "@euxdt/grid-core";
import { FunctionComponent, useRef, KeyboardEvent } from "react";
import { createTextField } from "../adapter";
import { createEditor } from "../shared/shared-props";

export const TextInputEditor: FunctionComponent<RendererProps> = ({ node }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputValRef = useRef<string>("");

    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const defaultValue = api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? itemToLabel(node.rowPosition?.data, node.columnPosition?.column!);
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const col = node.columnPosition?.column;
        if (!api.keyStrokeValid(e.nativeEvent, col)) {
            stopPrevent(e);
        }
        if(e.key === "Enter") {
            api.addChange(node.rowPosition!, node.columnPosition!, inputRef.current ? inputRef.current.value : inputValRef.current);
        }
    };
    return createEditor(createTextField(node.gridOptions, {
        onChange: (newVal) => {
            inputValRef.current = newVal;
        }, defaultValue: String(defaultValue), ref: inputRef, onKeyDown: handleKeyDown
    }), inputRef, rowIdentifier);
};


export const createTextInputEditorOptions = (editStartMode= EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: TextInputEditor,
    editStartMode,
});