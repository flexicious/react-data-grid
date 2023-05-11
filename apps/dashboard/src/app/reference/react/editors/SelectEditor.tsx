import { EditorProps, EditStartMode, FilterPageSortLoadMode, getApi, getColumnSelectEditorOptions, getRowColFromNode, NameValue, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { createSelectField } from "../adapter";
import { createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const SelectEditor: FunctionComponent<EditorProps> = ({ node, rowsToEdit }) => {
    const [loading, setLoading] = useState(false);
    const api = getApi(node);
    const allValues = getColumnSelectEditorOptions(node.columnPosition?.column!,node.gridOptions) as NameValue[];

    useEffect(() => {
        if (node.gridOptions?.filterPageSortMode === FilterPageSortLoadMode.Server) {
            if (node.columnPosition?.column && !node.gridOptions.serverInfo?.filterDistinctValues?.[node.columnPosition.column.dataField]) {
                const retVal = node.gridOptions.eventBus?.onFilterDistinctValuesRequested?.(node.columnPosition?.column);
                if (retVal === true) {
                    setLoading(true);
                }
            }
        }
    }, []);
    useEffect(() => {
        setLoading(false);
    }, [allValues.length]);
    const selectRef = useRef<HTMLSelectElement>(null);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const selectVal = rowsToEdit && rowsToEdit.length > 0 ? undefined : api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? resolveExpression(node.rowPosition?.data, node.columnPosition?.column!.dataField!);
    const handleChange = (newVal: unknown) => {
        applyEditedValue(node, newVal, rowsToEdit, true);
    };
    return <>
    {loading && <div className="ezgrid-dg-loading-message">Loading...</div> }
    { 
        createEditor(createSelectField(node.gridOptions, {
            ref: selectRef, options: allValues, onChange: handleChange, value: selectVal as string | number,
        }), selectRef, rowIdentifier)
    }
    </>;
};


export const createSelectEditorOptions = <T=unknown>(editStartMode = EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: SelectEditor as FunctionComponent<RendererProps<T>>,
    editStartMode,
});