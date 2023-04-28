import { ApiContext, ColumnOptions, ColumnWidthMode, createColumn, createEditBehavior, createFilterBehavior, EditInfo, EditStartMode, getApi, getRowColFromNode, GridSelectionMode, HorizontalScrollMode, itemToLabel, RendererProps } from "@ezgrid/grid-core";
import { CheckBoxEditor, DateEditor, ReactDataGrid, SelectEditor, TextInputEditor } from "@ezgrid/grid-react";
import { materialAdapter, materialNodePropsFunction } from "@ezgrid/grid-shared";
import { TextField, useTheme } from "@mui/material";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import Employee from "../mockdata/Employee";
import { getScrollOffBelow } from "../utils/column-utils";

const PhoneNumberEditor: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const { rowIdentifier, columnIdentifier } = getRowColFromNode(node);
    const val = (api.hasChange(rowIdentifier, columnIdentifier)?.newValue
        || itemToLabel(node.rowPosition?.data, node.columnPosition?.column!));
    const areaCodeRef = useRef<HTMLInputElement>(null);
    const prefixRef = useRef<HTMLInputElement>(null);
    const suffixRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (areaCodeRef.current) {
            areaCodeRef.current?.focus();
        }
    }, [rowIdentifier]);
    let areaCode = "", prefix = "", suffix = "";
    if (val) {
        [areaCode, prefix, suffix] = (val?.toString() || "").split("-");
    }
    const handleChange = () => {
        const areaCode = areaCodeRef.current?.value || "";
        const prefix = prefixRef.current?.value || "";
        const suffix = suffixRef.current?.value || "";
        api.addChange(node.rowPosition!, node.columnPosition!, `${areaCode}-${prefix}-${suffix}`);
    };
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab" && !e.shiftKey) {
            if (e.target !== suffixRef.current) {
                e.stopPropagation();
            }
        }
    };
    return <div className="ezgrid-dg-toolbar-section">
        <TextField inputProps={{ maxLength: 3, ref: areaCodeRef }} style={{ width: "25% " }} value={areaCode} onChange={handleChange}
            onKeyDown={handleKeyDown} variant="standard" />-
        <TextField inputProps={{ maxLength: 3, ref: prefixRef }} style={{ width: "25%" }} value={prefix} onChange={handleChange}
            onKeyDown={handleKeyDown} variant="standard" />-
        <TextField inputProps={{ maxLength: 4, ref: suffixRef }} style={{ width: "40%" }} value={suffix} onChange={handleChange}
            onKeyDown={handleKeyDown} variant="standard" />
    </div>;
};
export const MaterialEditors = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const theme = useTheme();
    const [data] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    const [editMode, setEditMode] = useState<boolean>(true);
    const [editStart, setEditStart] = useState<EditStartMode>(EditStartMode.Click);
    const [useMaterialAdapter, setUseMaterialAdapter] = useState(true);

    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        adapter: useMaterialAdapter ? materialAdapter : undefined,
        nodePropsFunction: useMaterialAdapter ? materialNodePropsFunction(theme): undefined,
        selectionMode: GridSelectionMode.MultipleCells,
        headerRowHeight: 75,
        enableFooters: false,
        enableFilters: false,
        horizontalScroll: getScrollOffBelow(),
        enablePaging: true,
        behaviors: [
            createEditBehavior({}),
            createFilterBehavior({})
        ],
        toolbarOptions: {
            enableGlobalSearch: false,
            enableQuickFind: false,
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                return <div className="ezgrid-dg-toolbar-section">

                    <button
                    onClick={() => {
                        setUseMaterialAdapter(!useMaterialAdapter);
                    }}
                    >
                    Toggle MUI Adapter
                    </button>

                    <button onClick={() => {
                        setEditMode(!editMode);
                        api.propsUpdated();
                    }}>{editMode ? "Disable Edit" : "Enable Edit"}</button>
                    <label>Start Edit Mode:</label>
                    <select value={editStart} onChange={(e) => {
                        setEditStart(e.target.value as EditStartMode);
                        api.propsUpdated();
                    }}>
                        <option value={EditStartMode.Click}>Click</option>
                        <option value={EditStartMode.DoubleClick}>Double Click</option>
                    </select>
                </div>;
            }
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            }
        }, columns: [
            {
                ...createColumn("employeeId", "string", "Id"),
                textAlign: "right",
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
            },
            {
                ...createColumn("annualSalary", "currency", "Annual Salary - Text Input Editor + validator salary >50K,<100K"),
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: editStart,
                    editorRenderer: TextInputEditor,
                    validateValueFunction: (value: EditInfo, columnOptions: ColumnOptions) => {
                        if (parseInt((value.newValue?.toString() || "").replace(/,/g, "")) < 50000) {
                            value.validationMessage = "Salary should be greater than 50000";
                        } else if (parseInt((value.newValue?.toString() || "").replace(/,/g, "")) > 100000) {
                            value.validationMessage = "Salary should be less than 100000";
                        } else {
                            value.validationMessage = "";
                        }
                        value.valid = value.validationMessage === "";
                        return value;
                    }
                }
            },
            {
                ...createColumn("hireDate", "date", "Hire Date - Date Editor"),
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: editStart,
                    editorRenderer: DateEditor,
                }

            },
            {
                ...createColumn("department", "string", "Department - Select Dropdown editor"),
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: editStart,
                    editorRenderer: SelectEditor,
                },
            },

            {
                ...createColumn("phoneNumber", "string", "Phone - Custom Editor + validator"),
                width: 150,
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: editStart,
                    validateValueFunction: (value: EditInfo) => {
                        const newVal = value.newValue;
                        const regex = /^\d{3}-\d{3}-\d{4}$/;
                        if (!regex.test(newVal?.toString() || "")) {
                            value.validationMessage = "Phone number must be in the format ###-###-####";
                            value.valid = false;
                        }
                        return value;
                    },
                    editorRenderer: PhoneNumberEditor
                }

            }, {
                ...createColumn("isActive", "boolean", "Active - Checkbox Editor"),
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: editStart,
                    editorRenderer: CheckBoxEditor,
                },
            },
            {
                ...createColumn("stateCode", "string", "State - Select Dropdown editor"),
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: editStart,
                    editorRenderer: SelectEditor,
                },
            },
            {
                ...createColumn("firstName", "string", "Click on cell and Start Typing"),
                headerOptions: { columnGroupText: "First/Last have Excel Edit Mode", },
                sortOptions: {
                    sortCaseInsensitive: true,
                },
                editOptions: {
                    enableEdit: editMode,
                    editStartMode: EditStartMode.Excel,
                    editorRenderer: TextInputEditor,
                },
                children: [
                    {
                        ...createColumn("lastName", "string", "Double Click for editor"),

                        sortOptions: {
                            sortCaseInsensitive: true,
                        },
                        editOptions: {
                            enableEdit: editMode,
                            editStartMode: EditStartMode.Excel,
                            editorRenderer: TextInputEditor,
                        },
                    }]
            }

        ]
    }}></ReactDataGrid>;
};