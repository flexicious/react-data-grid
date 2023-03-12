import { EditStartMode, getApi,  getRowColFromNode, NameValue, RendererProps, resolveExpression } from "@euxdt/grid-core";
import { FunctionComponent, useRef } from "react";
import { createSelectField } from "../adapter";
import { createEditor } from "../shared/shared-props";

export const SelectEditor: FunctionComponent<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const selectRef = useRef<HTMLSelectElement>(null);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const selectVal = api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        ?? resolveExpression(node.rowPosition?.data, node.columnPosition?.column!.dataField!);
    const allValues = api.getDistinctFilterValues(node.columnPosition?.column!) as NameValue[];
    const handleChange = (newVal: unknown) => {
        api.addChange(node.rowPosition!, node.columnPosition!, newVal);
    };
    return createEditor(createSelectField(node.gridOptions, {
        ref: selectRef, options: allValues, onChange: handleChange, value: selectVal as string | number,
    }), selectRef, rowIdentifier);
};


export const createSelectEditorOptions = (editStartMode= EditStartMode.Click) => ({
    enableEdit: true,
    editorRenderer: SelectEditor,
    editStartMode,
});