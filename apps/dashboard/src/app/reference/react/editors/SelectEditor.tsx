import { EditorProps, EditStartMode, FilterPageSortLoadMode, getApi, getRowColFromNode, NameValue, RendererProps, resolveExpression } from "@euxdt/grid-core";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { createSelectField } from "../adapter";
import { createEditor } from "../shared/shared-props";
import { applyEditedValue } from "./utils";

export const SelectEditor: FunctionComponent<EditorProps> = ({ node, rowsToEdit }) => {
    const [loading, setLoading] = useState(false);
    const api = getApi(node);
    const allValues = api.getDistinctFilterValues(node.columnPosition?.column!) as NameValue[];

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
        applyEditedValue(node, newVal, rowsToEdit);
    };
    return <>
    {loading && <div className="euxdt-dg-loading-message">Loading...</div> }
    { 
        createEditor(createSelectField(node.gridOptions, {
            ref: selectRef, options: allValues, onChange: handleChange, value: selectVal as string | number,
        }), selectRef, rowIdentifier)
    }
    </>;
};


export const createSelectEditorOptions = (editStartMode = EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: SelectEditor,
    editStartMode,
});