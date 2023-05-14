import { ApiContext, ColumnOptions, ColumnWidthMode, createColumn, createEditBehavior, createFilterBehavior, createSelectionColumn, DeltaOptions, DeltaType, EditInfo, EditStartMode, getApi, getRowColFromNode, GridOptions, GridSelectionMode, itemToLabel, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { CheckBoxEditor, createDeleteColumn, DateEditor, FormulaColumnEditor, ReactDataGrid, SelectEditor, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer, TextInputEditor } from "@ezgrid/grid-react";
import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import Employee from "../mockdata/Employee";
import { DataGrid } from "../components/DataGrid";

export const EditOptions = () => {
    const [loading, setLoading] = useState(false);
    const apiRef = useRef<ApiContext<Employee> | null>(null);

    const [editMode, setEditMode] = useState<boolean>(true);
    const [selectionMode, setSelectionMode] = useState<GridSelectionMode>(GridSelectionMode.MultipleCells);
    const [saveOnBlur, setSaveOnBlur] = useState<boolean>(false);
    const [editStart, setEditStart] = useState<EditStartMode>(EditStartMode.Excel);
    useEffect(() => {
        setDataProviderPlaceHolder(Employee.getAllEmployees());
    }, []);
    const setDataProviderPlaceHolder = (data: Employee[]) => {
        const placeHolderData: Employee[] = [];
        const numPlaceHolders = 0;//change this if you want to  allow place holders to add items
        if (!data.find((d: any) => d.placeHolder)) {
            for (let i = 0; i < numPlaceHolders; i++) {
                const placeHolder = new Employee();
                placeHolder.placeHolder = true;
                placeHolder.employeeId = "Add New - " + i;
                placeHolderData.push(placeHolder);
            }
        }
        setDataProvider([...placeHolderData, ...data,]);
    };
    const [dataProvider, setDataProvider] = useState<Employee[]>();
    const saveChanges = async (editInfo: EditInfo<Employee>[]) => {
        const api = apiRef.current?.api;
        if (!api) return;
        if (api.applyChanges(false)) {
            editInfo.forEach((e) => {e.dataField = api.getColumn(e.columnIdentifier)?.dataField || e.dataField});
            const insertedPlaceHolders = editInfo.filter(e => isPlaceHolder(e.rowIdentifier)).map(e => e.rowIdentifier);
            const changesForServer = [...editInfo];
            setLoading(true);
            const {insertedItems, updatedItems} = await mockServerApi.updateOrAddEmployee(changesForServer);
            setLoading(false);
            for (const change of changesForServer) {
                api.removeChange(change.rowIdentifier, change.columnIdentifier);
            }
            const newDp = api.processDeltaArray<Employee>([
                {
                    deltaNew: insertedItems,
                    deltaUpdated: updatedItems,
                }
            ])
            const insertedEmployeeIds = insertedItems.map(e => e.employeeId);
            setDataProviderPlaceHolder([...(newDp || [])]);
            [...insertedPlaceHolders, ...insertedEmployeeIds].forEach((id) => api.flashRow(id, "blue", 300, true));
            
        }
    }

    const deleteEmployee = async (data: Employee) => {
        if (data.placeHolder) {
            alert("Cannot delete a place holder");
            return;
        }
        if (!confirm("Are you sure you want to delete this employee?")) return;
        const api = apiRef.current?.api;
        if (!api) return;
        setLoading(true);
        await mockServerApi.deleteEmployee(data);
        setLoading(false);
        const newDp = api.processDelta({
            type: DeltaType.Remove,
            rows: [data]
        } as DeltaOptions<Employee>);
        //give the delta some time to flash before removing the row
        setTimeout(() => {
            setDataProviderPlaceHolder([...(newDp || [])]);
        }, 500);
    }
    const go:GridOptions<Employee> = useMemo(() => {
        return ({
            isMemo: true,
            dataProvider,
            uniqueIdentifierOptions: {
                useField: "employeeId"
            },
            placeHolderRowsOptions: {
                position: "above",
                identifierField: "placeHolder"
            },
            headerRowHeight: 100,
            enableFooters: false,
            selectionMode,
            enableFilters: false,
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
                        <label>Save Immediately:</label>
                        <input type="checkbox" checked={saveOnBlur} onChange={(e) => {
                            setSaveOnBlur(e.target.checked);
                        }} />
                        <button onClick={() => {
                            setEditMode(!editMode);
                            setSelectionMode(editMode ? GridSelectionMode.MultipleRows:GridSelectionMode.MultipleCells);
                            api.clearSelection();
                        }}>{editMode ? "Disable Edit" : "Enable Edit"}</button>
                        <label>Start Edit Mode:</label>
                        <select value={editStart} onChange={(e) => {
                            setEditStart(e.target.value as EditStartMode);
                        }}>
                            <option value={EditStartMode.Click}>Click</option>
                            <option value={EditStartMode.DoubleClick}>Double Click</option>
                            <option value={EditStartMode.Excel}>Excel</option>
                        </select>
                    </div>;
                }
            },
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiRef.current = ctx;
                },
                onSaveChanges: (editInfo) => {
                    //user clicked on the save button. 
                    saveChanges(editInfo);
                },
                onValueCommit: (editInfo) => {
                    if (saveOnBlur) {
                        //place holder cannot be autosaved. Need all cells to be filled first.
                        const nonPlaceHolderEditInfo = editInfo.filter((e) => !isPlaceHolder(e.rowIdentifier));
                        if (nonPlaceHolderEditInfo.length)
                            saveChanges(nonPlaceHolderEditInfo);
                    }
                },
            }, columns: [
                selectionMode === GridSelectionMode.MultipleRows && createSelectionColumn({
                    itemRenderer:SelectionCheckBoxRenderer,
                    headerRenderer: SelectionCheckBoxHeaderRenderer,
                }),
                selectionMode !== GridSelectionMode.MultipleRows &&createDeleteColumn((data) => deleteEmployee(data as Employee)),
                {
                    ...createColumn("employeeId", "string", "Id"),
                    textAlign: "right",
                    widthMode: ColumnWidthMode.Fixed,
                    width: 75,
                }, {
                    ...createColumn("updatedBy", "string", "Updated By"),
                    width: 95,
    
                }, {
                    ...createColumn("updatedDate", "date", "Updated Date"),
                    width: 95,
                },
                {
                    ...createColumn("firstName", "string", "First Name - Text Input Editor"),
                    sortOptions: {
                        sortCaseInsensitive: true,
                    },
                    editOptions: {
                        enableEdit: editMode,
                        editStartMode: editStart,
                        editorRenderer: TextInputEditor,
                    },
                },
                {
                    ...createColumn("lastName", "string", "First Name - Text Input Editor"),
    
                    sortOptions: {
                        sortCaseInsensitive: true,
                    },
                    editOptions: {
                        enableEdit: editMode,
                        editStartMode: editStart,
                        editorRenderer: TextInputEditor,
                    },
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
                        enableAutoComplete: true,
                        restrictValuesToOptions: true,
                    },
                },
                {
                    ...createColumn("ssNo", "string", "SSN - Text Input Editor + validation Regex"),
                    editOptions: {
                        enableEdit: editMode,
                        editStartMode: editStart,
                        editorRenderer: TextInputEditor,
                        validationRegex: "^\\d{3}-\\d{2}-\\d{4}$",
                        validationMessage: "SSN must be in the format ###-##-####"
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
                        enableAutoComplete: true,
                        autoCompleteOptions: ALL_STATES,
                        restrictValuesToOptions: true,
                    },
                }
    
            ].filter((c) => c) as ColumnOptions<Employee>[],
        });
    },[editMode, selectionMode, saveOnBlur, editStart, dataProvider]);


    return <>{loading && <div className="ezgrid-dg-loading-message">Saving...</div>}
        <DataGrid style={{ height: "100%", width: "100%" }} gridOptions={go}/></>;
};
//this could come from the server
const ALL_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
    "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const isPlaceHolder = (id: string) => {
    return id.indexOf("Add New - ") === 0;
};

const idField = "employeeId";
const mockServerApi = {
    deleteEmployee:  async (employee: Employee) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return true;
    },
    updateOrAddEmployee: async (editInfo: EditInfo<Employee>[]) => {
        const updatedItems: Employee[] = [];
        const insertedItems: Employee[] = [];
        for (const edit of editInfo) {
            if (isPlaceHolder(edit.rowIdentifier)) {
                if (insertedItems.indexOf(edit.editedItem) === -1) {
                    insertedItems.push(edit.editedItem);
                }
            } else {
                if (updatedItems.indexOf(edit.editedItem) === -1) {
                    updatedItems.push(edit.editedItem);
                }
            }
        }
        //here we update the database, and rehydrate the items - this is just dummy, 
        //in real life you would write some SQL or call a service to update the database
        const newUpdatedItems:Employee[] = JSON.parse(JSON.stringify(updatedItems));
        const newInsertedItems:Employee[] = JSON.parse(JSON.stringify(insertedItems));
            
        for (const edit of editInfo) {
            const isInsert = isPlaceHolder(edit.rowIdentifier);
            const collection = isInsert ? newInsertedItems : newUpdatedItems;
            const item = collection.find((i: unknown) => resolveExpression(i, idField) === resolveExpression(edit.editedItem, idField));
            if (!item) continue;
            resolveExpression(item, edit.dataField || edit.columnIdentifier, edit.appliedValue);
            resolveExpression(item, "updatedBy", "user1");
            resolveExpression(item, "updatedDate", new Date());
        }
        for (const item of newInsertedItems) {
            item.placeHolder= false;
            resolveExpression(item, idField, String(new Date().getTime()));
            resolveExpression(item, "createdBy", "user1");
            resolveExpression(item, "createdDate", new Date());                        
        }
        //return back the updated/inserted items
        return { updatedItems: newUpdatedItems, insertedItems: newInsertedItems };
    },
};

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
            if (e.currentTarget !== suffixRef.current) {
                e.stopPropagation();
            }
        }
    };

    return <div className="ezgrid-dg-toolbar-section">
        <input maxLength={3} style={{ width: "25%" }} value={areaCode} ref={areaCodeRef} onChange={handleChange}
            onKeyDown={handleKeyDown} />-
        <input maxLength={3} style={{ width: "25%" }} value={prefix} ref={prefixRef} onChange={handleChange}
            onKeyDown={handleKeyDown} />-
        <input maxLength={4} style={{ width: "40%" }} value={suffix} ref={suffixRef} onChange={handleChange}
            onKeyDown={handleKeyDown} />
    </div>;
};