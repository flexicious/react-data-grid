import {
    camelCaseToSpace,
    ColumnOptions,
    createColumn,
    createFilterBehavior,
    EditOptions,
    EditStartMode,
    FilterOperation,
    FilterOptions,
    getApi,
    gridCSSPrefix,
    GridIconButton,
    GridOptions,
    GridSection,
    GRID_CONSTANTS,
    HorizontalScrollMode,
    NameValue,
    RendererProps, VirtualTreeNode, resolveExpression
} from "@ezgrid/grid-core";
import { ReactNode, RefObject, useEffect } from "react";
import { createIconButton } from "../adapter";
import { createCheckBoxEditorOptions, createDateEditorOptions, createSelectEditorOptions, createTextInputEditorOptions } from "../editors";
import { createDateFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions } from "../filters";
import {
    SelectionCheckBoxHeaderRenderer,
    SelectionCheckBoxRenderer
} from "../selection";
export const EMPTY_COL_PROPS = { enableResize: false, enableMove: false, enableSort: false, enableCellClickRowSelect: true, enableColumnMenu: false, enableFocus: false };
export const COL_PROPS = (selectable?: boolean): Partial<ColumnOptions> => ({
    filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
    ...EMPTY_COL_PROPS, selectionCheckBoxOptions: selectable
        ? {
            enableSelectionCheckBox: true,
            selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
            selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer,
        }
        : undefined,
});

export const GRID_PROPS = (
    node: VirtualTreeNode,
    uniqueIdentifier: string
): Partial<GridOptions> & Pick<GridOptions, "uniqueIdentifierOptions"> => ({
    behaviors: [createFilterBehavior({})], horizontalScroll: HorizontalScrollMode.Off,
    uniqueIdentifierOptions: { useField: uniqueIdentifier, }, adapter: node.gridOptions.adapter, enableDynamicLevels: true, enableActiveCellHighlight: false, selectionOptions: {

    },
    nextLevel: {
        childrenField: "children",
    },
    cellStyleFunction: (cell) => {
        return {
            border: "none",
        };
    },
    rowStyleFunction: (row) => {
        return {
            border: "none",
        };
    },
    dividerOptions: {
        header: false,
        footer: false,
        filter: false,
        body: false,
        toolbar: false,
    },
    nodePropsFunction: node.gridOptions.nodePropsFunction,
    enableToolbar: false,
    enableFooters: false,
    enableFilters: true,
    enableColumnMenu: false,
});

export const buttonCreator = (
    node: VirtualTreeNode,
    icon: string,
    title: string,
    onClick: (e?: any) => void,
    type: GridIconButton,
    disabled?: boolean
) =>
    createIconButton(
        node.gridOptions,
        type,
        <button
            title={title}
            className={gridCSSPrefix(icon)}
            onClick={onClick}
            disabled={disabled}
        >
            {" "}
        </button>
    );

export const createEditor = (
    child: ReactNode,
    inputRef?: RefObject<HTMLInputElement | HTMLSelectElement>,
    rowIdentifier?: string,
    styles?: Record<string, unknown>
) => {
    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [rowIdentifier, inputRef]);
    return (
        <div key={"editor"} className={gridCSSPrefix("editor")} style={styles}>
            {" "}
            {child}
        </div>
    );
};
export const actionColumnProps: Partial<ColumnOptions> = {
    enableSort: false, enableResize: false, enableMove: false, textAlign: "center", enableColumnMenu: false,
    excludeFromSettings: true, enableFocus: false, excludeFromPdf: true, excludeFromExcel: true, enableCellClickRowSelect: false,
};
export const createIconColumn = (
    iconCss: string,
    iconButton: GridIconButton,
    title: string,
    onClick?: (item: unknown, api: ReturnType<typeof getApi>, node: VirtualTreeNode) => void,
    width?: number,
    makeHeader?: boolean,
    showIcon?: (item: unknown, api: ReturnType<typeof getApi>, type: GridSection.Header | GridSection.Body) => boolean,
): ColumnOptions => {
    let col: ColumnOptions = {
        ...createColumn(title, "string", " ", title),
        ...actionColumnProps,
        width: width || GRID_CONSTANTS.DEFAULT_ICON_COL_WIDTH,
        itemRenderer: (props: RendererProps) => {
            const node = props.node;
            const data = node.rowPosition?.data;
            const api = getApi(node);
            const iconVisible = showIcon ? showIcon(data, api, GridSection.Body) : true;
            return (
                <>
                    {iconVisible && buttonCreator(node, iconCss, title, () => {
                        onClick?.(data, api, node);
                    }, iconButton)}
                </>
            );
        },
    };
    if (makeHeader) {
        col.headerOptions = {
            headerRenderer: (props: RendererProps) => {
                const node = props.node;
                const api = getApi(node);
                const selection = api.getSelectedObjects().length > 0;
                const iconVisible = showIcon ? showIcon(undefined, api, GridSection.Header) : true;
                return (
                    <>
                        {iconVisible && selection && buttonCreator(node, iconCss, title, () => {
                            api.getSelectedObjects().forEach((row) => onClick?.(row, api, node));
                        }, iconButton
                        )}
                    </>
                );
            },
        };
    }
    return col;
};
export const DELETE_COL_UNIQUE_ID = "Delete Column";
export const createDeleteColumn = (
    onClick: (item: unknown, api: ReturnType<typeof getApi>, node: VirtualTreeNode) => void,
    makeHeader?: boolean,
    showIcon?: (item: unknown, api: ReturnType<typeof getApi>, type: GridSection.Header | GridSection.Body) => boolean,
): ColumnOptions => {
    let col = createIconColumn("delete-icon", GridIconButton.Delete, DELETE_COL_UNIQUE_ID, onClick, 45, makeHeader, showIcon);
    return col;
};
export const EDIT_COL_UNIQUE_ID = "Edit";
export const createEditColumn = (
    editOptions?: EditOptions,
    onClick?: (item: unknown, api: ReturnType<typeof getApi>, node: VirtualTreeNode) => void,
    makeHeader?: boolean,
    showIcon?: (item: unknown, api: ReturnType<typeof getApi>, type: GridSection.Header | GridSection.Body) => boolean,
): ColumnOptions => {
    let col = createIconColumn("edit-icon", GridIconButton.Edit, EDIT_COL_UNIQUE_ID, onClick, 45, makeHeader, showIcon);
    col.editOptions = {
        enableEdit: true,
        editorHandlesTabEnter: true,
        editStartMode: EditStartMode.Click,
        ...editOptions,
    };
    return col;
};
export const getFilterOptions = ({ type, distinctValues }: { type: string, distinctValues?: string[] | NameValue[] | undefined }): FilterOptions => {
    switch (type) {
        case "string":
            return (distinctValues || []).length > 0 ? {
                ...createMultiSelectFilterOptions(),
                filterComboBoxDataProvider: distinctValues!.map(v => (typeof v === "string" ? { name: v, value: v } : v))
            } : createTextInputFilterOptions(FilterOperation.BeginsWith);
        case "number":
            return createNumericRangeFilterOptions();
        case "boolean":
            return createTriStateCheckBoxFilterOptions();
        case "date":
            return createDateFilterOptions();
        default:
            return createTextInputFilterOptions(FilterOperation.BeginsWith);
    }
};
export const getEditOptions = ({ type, distinctValues }: { type: string, distinctValues?: string[] | NameValue[] | undefined }): EditOptions => {
    switch (type) {
        case "string":
            return (distinctValues || []).length > 0 ? {
                ...createSelectEditorOptions()
            } : createTextInputEditorOptions();
        case "number":
            return createTextInputEditorOptions();
        case "boolean":
            return createCheckBoxEditorOptions();
        case "date":
            return createDateEditorOptions();
        default:
            return {};
    }
};

export const jsonSchemaToColumns = (jsonSchema: any) => {
    const properties = jsonSchema.properties;
    const columns: ColumnOptions[] = [];
    const propertyToColumn = (key: string, type: string, distinctValues: string[]) => {
        const format = getFormat(type);
        const column: ColumnOptions = {
            dataField: key,
            headerText: camelCaseToSpace(key),
            uniqueIdentifier: key,
            format: format,
            filterOptions: getFilterOptions({ type: format, distinctValues }),
            editOptions: getEditOptions({ type: format, distinctValues }),
        };
        if(type === "number"){
            column.formatterPrecision = 2;
        }
        if (format === "boolean") {
            column.width = 75;
            column.textAlign = "center";
        }
        return column;
    };
    Object.keys(properties).forEach((key) => {
        if (properties[key].$ref) {
            const definition = jsonSchema.definitions[properties[key].$ref.split("/")[2]];
            const subProperties = definition?.properties;
            Object.keys(subProperties).forEach((subKey) => {
                columns.push(propertyToColumn(`${key}.${subKey}`, subProperties[subKey].type, subProperties[subKey].enum));
            });
        }
        else
            columns.push(propertyToColumn(key, properties[key].type, properties[key].enum));
    });
    return columns;
};
const getFormat = (type: string) => {
    switch (type) {
        case "string":
            return "string";
        case "number":
            return "number";
        case "integer":
                return "number";
        case "boolean":
            return "boolean";
        case "date":
            return "date";
        default:
            return "string";
    }
};

export interface Attribute {
    name: string;
    type: string;
    distinctValues?: string[];
}

export interface GridProperty {
    name: string;
    property: string;
    type: "string" | "number" | "boolean" | "enum" | "button" | "object";
    value: any;
    options?: NameValue[];
    children?: GridProperty[];
}


const getDistinctValues = (data: any[], key: string) => {
    const values = new Set<string>();
    for (const item of data) {
        values.add(resolveExpression(item, key) || "");
    }
    const result = Array.from(values);
    if (result.length === 1 || result.length > data.length / 2) {
        return [];
    }
    return result;
};

const getType = (value: any) => {
    if (value instanceof Date) {
        return "date";
    } else if (typeof value === "string") {
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
            return "date";
        }
        //if yyyy-mm-dd
        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return "date";
        }
        //if number is in string format
        // if (!isNaN(parseInt(value))) {
        //     return "number";
        // }
        return "string";
    } else if (typeof value === "number") {
        return "number";
    } else if (typeof value === "boolean") {
        return "boolean";
    } else if (typeof value === "object" && value !== null) {
        return "object";
    }
    return undefined;
};
export const generateColumnsFromJson=(data:any[],colPropOverrides?:Record<string, Record<string, any>>, colProps?:GridProperty[]) => {
    if (!Array.isArray(data)) {
        data = [data];
    }
    const attributes: Attribute[] = [];
    const first = data[0];
    for (const key in first) {
        const addAttributes = (key: string, value: any) => {
            const type = getType(value);
            if (Array.isArray(value)) {
                //ignore arrays
            }
            else if (type === "object") {
                for (const subKey in value) {
                    addAttributes(`${key}.${subKey}`, value[subKey]);
                }
            }
            attributes.push({
                name: key,
                type: type ?? "string",
                distinctValues: type === "string" ? getDistinctValues(data, key) : undefined,
            });
        };
        addAttributes(key, first[key]);
    }

    const applyColPropOverrides = (props: GridProperty[], target: Record<string, unknown>, col: ColumnOptions) => {
        if(!colPropOverrides) return;
        for (const prop of props) {
            if (prop.children) {
                target[prop.property] = {};
                applyColPropOverrides(prop.children, target[prop.property] as Record<string, unknown>, col);
            } else {
                const value = colPropOverrides[col.uniqueIdentifier]?.[prop.property];
                if (value !== undefined) {
                    if (prop.type === "boolean") {

                        if (value === "true")
                            target[prop.property] = true;
                        else if (value === "false")
                            target[prop.property] = false;
                    }
                    else if (prop.type === "number" && !isNaN(parseInt(value)))
                        target[prop.property] = parseInt(value);
                    else if (value)
                        target[prop.property] = value;

                }

            }
        }
    };

    const cols: ColumnOptions[] = [];
    for (const attribute of attributes) {
        const name = attribute.name.split(".").pop() || attribute.name;
        const col: ColumnOptions = {
            dataField: `${attribute.name}`,
            headerText: `${camelCaseToSpace(name)}`,
            uniqueIdentifier: `${attribute.name}`,
            format: attribute.type as any,
            filterOptions: { ...getFilterOptions(attribute)},
        };
        if(colProps)
        applyColPropOverrides(colProps, col as unknown as Record<string, unknown>, col);
        cols.push(col);
    }
    return cols;
};