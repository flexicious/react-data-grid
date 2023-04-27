import { NameValue, RendererProps, ColumnOptions, CheckBoxState, debounce, EditStartMode, FilterOperation, FooterOperation, GridSelectionMode, HorizontalScrollMode, LockMode } from "@ezgrid/grid-core";
import { GridProperty, TriStateCheckBox } from "@ezgrid/grid-react";
import { TextField, MenuItem, Box, Select } from "@mui/material";
import { ReactNode } from "react";



interface ColumnConfigRenderer extends RendererProps {
    onChange: (dt: GridProperty) => void;
    property: GridProperty;
    parentProperty: GridProperty|null|undefined;
    colPropOverrides: Record<string, Record<string, any>>;
}
export const ConfigRenderer = (props: ColumnConfigRenderer) => {
    const { property,parentProperty, onChange, node,colPropOverrides } = props;
    const col = node.rowPosition?.data as ColumnOptions;
    const dt = property;
    const setValue = (val: any) => {
        colPropOverrides[col.uniqueIdentifier] = colPropOverrides?.[col.uniqueIdentifier] || {};
        if(parentProperty){
            colPropOverrides[col.uniqueIdentifier][parentProperty.property] = colPropOverrides[col.uniqueIdentifier][parentProperty.property] || {};
            colPropOverrides[col.uniqueIdentifier][parentProperty.property][dt.property] = val;
        }
        else {
            colPropOverrides[col.uniqueIdentifier][dt.property] = val;
        }
        onChange(dt);
    };
    let value = parentProperty? colPropOverrides?.[col.uniqueIdentifier]?.[parentProperty.property]?.[dt.property] : colPropOverrides?.[col.uniqueIdentifier]?.[dt.property];
    if(!value && dt.property ==="format"){
        value = col?.format;
    }

    if (dt.type === "boolean") {
        return <TriStateCheckBox node={node} onChange={(val:CheckBoxState) => {
            setValue(val);
        }} value={
            value === "true" ? CheckBoxState.CHECKED :
                value === "false" ? CheckBoxState.UNCHECKED :
                    CheckBoxState.INDETERMINATE
        } allowIndeterminate={true} />;
    }
    else if (dt.type === "number") {
        return <TextField type="number" defaultValue={value || ""} onChange={debounce((e: any) => {
            setValue(e.target.value ? parseInt(e.target.value) : undefined);
        }, 600)} variant="standard" fullWidth />;
    }
    else if (dt.type === "string") {
        return <TextField variant="standard" defaultValue={value} onChange={debounce((e: any) => {
            setValue(e.target.value);
        }, 600)} />;
    }
    else if (dt.type === "enum") {
        return <Select variant="standard" fullWidth value={value || ""} onChange={(e) => {
            setValue(e.target.value || undefined);
            onChange(dt);
        }}>
            {[{ name: "Not Set", value: "" }, ...(dt.options || [])].map((ev: NameValue, idx) => {
                return <MenuItem value={ev.value || ""} key={idx}>{ev.name}</MenuItem>;
            })}
        </Select>;
    } 

    return null;
};

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                   {children}
                </Box>
            )}
        </div>
    );
};





export const getFilterOptionsString = (col:ColumnOptions): string => {
    if(!col.filterOptions) {
        return "";
    }
    switch (col.format) {
        case "string":
            return col.filterOptions.filterOperation === FilterOperation.InList ? "createMultiSelectFilterOptions()" : "createTextInputFilterOptions(FilterOperation.Wildcard)";
        case "number":
            return "createNumericRangeFilterOptions()";
        case "boolean":
            return "createTriStateCheckBoxFilterOptions()";
        case "date":
            return "createDateFilterOptions()";
        default:
            return "createTextInputFilterOptions(FilterOperation.Wildcard)";
    }
};




export const GRID_PROPS = [
    {
        name: "Selection CheckBox",
        property: "",
        type: "button",
        value: undefined,
    },
    {
        name: "Drag Column",
        property: "",
        type: "button",
        value: undefined,
    },
    {
        name: "Delete Column",
        property: "",
        type: "button",
        value: undefined,
    },
    {
        name: "Toolbar Options",
        property: "toolbarOptions",
        type: "object",
        value: undefined,
        children: [
            {
                name: "Enable Global Search",
                property: "enableGlobalSearch",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Filter Chips",
                property: "enableFilterchips",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Quick Find",
                property: "enableQuickFind",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Pdf",
                property: "enablePdf",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Excel",
                property: "enableExcel",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Expander",
                property: "enableExpander",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Grouping Dropzone",
                property: "enableGroupingDropzone",
                type: "boolean",
                value: undefined
            },
            {
                name: "Enable Settings",
                property: "enableSettings",
                type: "boolean",
                value: undefined
            },
            {
                name: "Change Delay",
                property: "changeDelay",
                type: "number",
                value: undefined
            },
        ]
    },

    {
        name: "Enable Toolbar",
        property: "enableToolbar",
        type: "boolean",
        value: undefined,
    },
    {
        name: "Enable Filters",
        property: "enableFilters",
        type: "boolean",
        value: undefined,
    },
    {
        name: "Enable Paging",
        property: "enablePaging",
        type: "boolean",
        value: undefined,
    },
    {
        name: "Pagination Options",
        property: "paginationOptions",
        type: "object",
        value: undefined,
        children: [
            {
                name: "Page Size",
                property: "pageSize",
                type: "number",
                value: undefined,
            },
            {
                name: "Enable Page Size Selector",
                property: "enablePageSizeSelector",
                type: "boolean",
                value: undefined,
            },
        ]
    },
    {
        name: "Sort Options",
        property: "sortOptions",
        type: "object",
        value: undefined,
        children: [
            {
                name: "Enable Multi Column Sort",
                property: "enableMultiColumnSort",
                type: "boolean",
                value: undefined,
            },
        ]
    },

    {
        name: "Is Loading",
        property: "isLoading",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableColumnMenu",
        name: "Enable Column Menu",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableContextMenu",
        name: "Enable Context Menu",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableFloatingHeaderRows",
        name: "Enable Floating Header Rows (Hierarchical Grid)",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableDynamicLevels",
        name: "Enable (Hierarchical Grid - Dynamic Levels)",
        type: "boolean",
        value: undefined,
    },
    {
        property: "nextLevel",
        name: "Next Level",
        type: "object",
        value: undefined,
        children: [
            {
                property: "childrenField",
                name: "Children Field",
                type: "string",
                value: undefined,
            }]
    },
    {
        property: "enableActiveCellHighlight",
        name: "Enable Active Cell Highlight",
        type: "boolean",
        value: undefined,
    },
    {
        property: "selectionMode",
        name: "Selection Mode",
        type: "enum",
        value: undefined,
        //options: Object.entries(GridSelectionMode).map(([key, value]) => ({ name: key, value })),
        options: [
            { name: GridSelectionMode.None, value: "GridSelectionMode.None" },
            { name: GridSelectionMode.SingleCell, value: "GridSelectionMode.SingleCell" },
            { name: GridSelectionMode.SingleRow, value: "GridSelectionMode.SingleRow" },
            { name: GridSelectionMode.MultipleCells, value: "GridSelectionMode.MultipleCells" },
            { name: GridSelectionMode.MultipleRows, value: "GridSelectionMode.MultipleRows" }        
        ]
    },
    {
        property: "selectionOptions",
        name: "Selection Options",
        type: "object",
        value: undefined,
        children: [
            {
                property: "enableSelectionHighlight",
                name: "Enable Selection Highlight",
                type: "boolean",
                value: undefined,
            },
            {
                property: "enableSelectionCascade",
                name: "Enable Selection Cascade",
                type: "boolean",
                value: undefined,
            },
            {
                property: "enableSelectionBubble",
                name: "Enable Selection Bubble",
                type: "boolean",
                value: undefined,
            },
            {
                property: "useExcelLikeShiftAndCtrlKeys",
                name: "Use Excel Like Shift And Ctrl Keys",
                type: "boolean",
                value: undefined,
            },
        ]
    },

    {
        property: "horizontalScrollMode",
        name: "Horizontal Scroll Mode",
        type: "enum",
        value: undefined,
        // options: Object.entries(HorizontalScrollMode).map(([key, value]) => ({ name: key, value })),
        options: [
            { name: HorizontalScrollMode.On, value: "HorizontalScrollMode.On" },
            { name: HorizontalScrollMode.Off, value: "HorizontalScrollMode.Off" },
        ]
    },
    {
        property: "settingsOptions",
        name: "Settings Options",
        type: "object",
        value: undefined,
        children: [
            {
                property: "settingsStorageKey",
                name: "Settings Storage Key",
                type: "string",
                value: undefined,
            },
            {
                property: "enableSaveAsYouGo",
                name: "Enable Save As You Go",
                type: "boolean",
                value: undefined,
            },
        ]
    },
    {
        property: "dividerOptions",
        name: "Divider Options",
        type: "object",
        value: undefined,
        children: [
            {
                property: "header",
                name: "Header",
                type: "boolean",
                value: undefined,
            },
            {
                property: "body",
                name: "Body",
                type: "boolean",
                value: undefined,
            },
            {
                property: "footer",
                name: "Footer",
                type: "boolean",
                value: undefined,
            },
            {
                property: "filter",
                name: "Filter",

                type: "boolean",
                value: undefined,
            },
            {
                property: "toolbar",
                name: "Toolbar",
                type: "boolean",
                value: undefined,
            },
            {
                property: "leftLocked",
                name: "Left Locked",
                type: "boolean",
                value: undefined,
            },
            {
                property: "rightLocked",
                name: "Right Locked",
                type: "boolean",
                value: undefined,
            },
        ]

    },
    {
        property: "rowHeight",
        name: "Row Height",
        type: "number",
        value: undefined,
    },
    {
        property: "headerRowHeight",
        name: "Header Row Height",
        type: "number",
        value: undefined,
    },
    {
        property: "footerRowHeight",
        name: "Footer Row Height",
        type: "number",
        value: undefined,
    },
    {
        property: "filterRowHeight",
        name: "Filter Row Height",
        type: "number",
        value: undefined,
    },
    {
        property: "toolbarHeight",
        name: "Toolbar Height",
        type: "number",
        value: undefined,
    }
];


export const colProps: GridProperty[] = [

    {
        property: "format",
        name: "Format",
        type: "enum",
        value: undefined,
        options: [
            { name: "string", value: "string" },
            { name: "number", value: "number" },
            { name: "boolean", value: "boolean" },
            { name: "date", value: "date" },
            { name: "dateTime", value: "dateTime" },
            { name: "currency", value: "currency" },
        ],
    },
    {
        property: "excludeFromPdf",
        name: "Exclude From Pdf",
        type: "boolean",
        value: undefined,
    },
    {
        property: "excludeFromExcel",
        name: "Exclude From Excel",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableHierarchy",
        name: "Enable Hierarchy",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableSort",
        name: "Enable Sort",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableResize",
        name: "Enable Resize",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableMove",
        name: "Enable Move",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableDrag",
        name: "Enable Drag",
        type: "boolean",
        value: undefined,
    },
    {
        property: "excludeFromSettings",
        name: "Exclude From Settings",
        type: "boolean",
        value: undefined,
    },
    {
        property: "enableCellClickRowSelect",
        name: "Enable Cell Click Row Select",

        type: "boolean",
        value: undefined,
    },
    {
        property: "enableFocus",
        name: "Enable Focus",
        type: "boolean",
        value: undefined,
    },
    {
        property: "hidden",
        name: "Hidden",
        type: "boolean",
        value: undefined,
    },
    {
        property: "lockMode",
        name: "Lock Mode",
        type: "enum",
        value: undefined,
        // options: Object.entries(LockMode).map(([key, value]) => ({ name: key, value })),
        options: [
            { name: LockMode.None, value: "LockMode.None" },
            { name: LockMode.Left, value: "LockMode.Left" },
            { name: LockMode.Right, value: "LockMode.Right" },
        ],

    },
    {
        property: "enableColumnMenu",
        name: "Enable Column Menu",
        type: "boolean",
        value: undefined,
    },
    {
        property: "widthMode",
        name: "Width Mode",
        type: "enum",
        value: undefined,
        options: [
            { name: "percent", value: "percent" },
            { name: "fixed", value: "fixed" },
            { name: "fitToContent", value: "fitToContent" },
        ],
    },
    {
        property: "formatterPrecision",
        name: "Formatter Precision",
        type: "number",
        value: undefined,
    },

    {
        property: "textAlign",
        name: "Text Align",
        type: "enum",
        value: undefined,
        options: [
            { name: "center", value: "center" },
            { name: "right", value: "right" },
        ],
    },
    {
        property: "editOptions",
        name: "Edit Options",
        type: "object",
        value: undefined,
        children: [
            {
                property: "editStartMode",
                name: "Edit Start Mode",
                type: "enum",
                value: undefined,
                // options: Object.entries(EditStartMode).map(([key, value]) => ({ name: key, value })),
                options: [
                    { name: EditStartMode.Click, value: "EditStartMode.Click" },
                    { name: EditStartMode.DoubleClick, value: "EditStartMode.DoubleClick" },
                    { name: EditStartMode.Excel, value: "EditStartMode.Excel" },
                ],
            },
            {
                property: "enableEdit",
                name: "Enable Edit",
                type: "boolean",
                value: undefined,
            },
        ]
    },
    {
        property: "width",
        name: "Width",
        type: "number",
        value: undefined,
    },
    {
        property: "percentWidth",
        name: "Percent Width",
        type: "number",
        value: undefined,
    },
    {
        property: "variableRowHeightOptions",
        name: "Variable Row Height Options",
        type: "object",
        value: undefined,
        children: [
            {
                property: "enabled",
                name: "Enabled",
                type: "boolean",
                value: undefined,

            }
        ],
    },
    {
        property: "headerOptions",
        name: "Header Options",
        type: "object",
        value: undefined,
        children: [
            //headerTooltip
            {
                property: "headerTooltip",
                name: "Header Tooltip",
                type: "string",
                value: undefined,
            },

        ],
    },
    {
        property: "footerOptions",
        name: "Footer Options",
        type: "object",
        value: undefined,
        children: [
            {
                property: "footerOperation",
                name: "Footer Operation",
                type: "enum",
                value: undefined,
                // options: Object.entries(FooterOperation).map(([key, value]) => ({ name: key, value })),
                options: [
                    { name: FooterOperation.Avg, value: "FooterOperation.Avg" },
                    { name: FooterOperation.Count, value: "FooterOperation.Count" },
                    { name: FooterOperation.Max, value: "FooterOperation.Max" },
                    { name: FooterOperation.Min, value: "FooterOperation.Min" },
                    { name: FooterOperation.Sum, value: "FooterOperation.Sum" },
                ],
            }
            , {
                property: "footerOperationPrecision",
                name: "Footer Operation Precision",
                type: "number",
                value: undefined,
            }, {
                property: "footerLabel",
                name: "Footer Label",
                type: "string",
                value: undefined,
            }

        ],
    },
    {
        property: "sortOptions",
        name: "Sort Options",
        type: "object",
        value: undefined,
        children: [
            //sortNumeric
            //sortCaseInsensitive
            {
                property: "sortCaseInsensitive",
                name: "Sort Case Insensitive",
                type: "boolean",
                value: undefined,
            },
            {
                property: "sortNumeric",
                name: "Sort Numeric",
                type: "boolean",
                value: undefined,
            },

        ],
    },
];
