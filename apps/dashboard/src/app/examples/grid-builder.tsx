import { ApiContext, CheckBoxState, ColumnOptions, createColumn, createDragColumn, createEditBehavior, createFilterBehavior, createSelectionColumn, debounce, DRAG_COLUMN_ID, getApi, GridSelectionMode, LockMode, NameValue, pasteToClipboard, resolveExpression, SELECTION_COL_UNIQUE_ID } from "@ezgrid/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@ezgrid/grid-export";
import { createDeleteColumn, DELETE_COL_UNIQUE_ID, generateColumnsFromJson, GridProperty, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer, TriStateCheckBox } from "@ezgrid/grid-react";
import { Button, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { muiAdapter } from "@ezgrid/grid-adapter-mui";
import { CalculatedFieldEditorWrapper } from "../components/CalculatedFieldEditor";
import Employee from "../mockdata/Employee";
import SampleData from "../mockdata/SampleData";
import { colProps, ConfigRenderer, getFilterOptionsString, GRID_PROPS, TabPanel } from "./live-editor-utils";

export const GridBuilder = () => {
    const jsonRef = React.useRef<HTMLInputElement>(null);

    const [step, setStepInner] = useState(1);
    const [tabIndex, setTabIndexInner] = useState(0);
    const [subTabIndex, setSubTabIndex] = useState(0);
    const [showFormulaEditor, setShowFormulaEditor] = useState(false);

    const [dataProvider, setDataProvider] = useState([]);
    const [columns, setColumns] = useState<ColumnOptions[]>([]);
    const [additionalColumns, setAdditionalColumnsInner] = useState<ColumnOptions[]>([]);
    const [rawJson, setRawJson] = useState("");
    const [gridProps, setGridProps] = useState<any>(GRID_PROPS);
    const [gridPropOverrides, setGridPropOverridesInner] = useState<any>({});
    const [colPropOverrides, setColPropOverrides] = useState<Record<string, Record<string, any>>>({}); // { [colId]: { [prop]: value } }
    const apiRef = useRef<ApiContext | null>(null);

    const setTabIndex = (idx: number) => {
        setTabIndexInner(idx);
        if (idx === 0) {
            onGenerate((rawJson));
        }
    };
    const setStep = (step: number) => {
        if (step === 1) {
            setRawJson("");
            setColumns([]);
            setAdditionalColumns([]);
            setDataProvider([]);
            setGridPropOverridesInner({});
            setColPropOverrides({});
            setTabIndex(0);
        }

        setStepInner(step);
    };
    const setAdditionalColumns = (cols: ColumnOptions[]) => {
        setAdditionalColumnsInner(cols);
    };

    const setGridPropOverrides = () => {
        const newObject: Record<string, unknown> = {};
        const applyGridPropOverrides = (props: GridProperty[], target: Record<string, unknown>) => {
            for (const prop of props) {
                if (prop.children) {
                    target[prop.property] = {};
                    applyGridPropOverrides(prop.children, target[prop.property] as Record<string, unknown>);
                } else if (prop.value !== undefined) {
                    if (prop.type === "boolean") {
                        if (prop.name === "enableDynamicLevels") {
                            target["nextLevel"] = target["nextLevel"] || {};
                        }
                        if (prop.value === "true")
                            target[prop.property] = true;
                        else if (prop.value === "false")
                            target[prop.property] = false;
                    }
                    else if (prop.type === "number" && !isNaN(parseInt(prop.value)))
                        target[prop.property] = parseInt(prop.value);
                    else if (prop.value)
                        target[prop.property] = prop.value;

                }
            }
        };
        applyGridPropOverrides(gridProps, newObject);
        setGridPropOverridesInner(newObject);
        doPropUpdate();
    };
    const doPropUpdate = () => {
        apiRef.current?.api?.propsUpdated();
        onGenerate((rawJson));
    };
    useEffect(() => {
        onGenerate((rawJson));
    }, [gridPropOverrides, colPropOverrides, additionalColumns, rawJson]);


    const handleSampleDataChange = (idx: string) => {
        const sampleData = [
            Employee.getAllEmployees(),
            SampleData.bookData,
            SampleData.networkData,
        ];
        if (jsonRef.current) {
            jsonRef.current.value = JSON.stringify(sampleData[parseInt(idx)], null, 2);
            onGenerate((jsonRef.current.value));
        }
    };


    const handleNextStep = () => {
        if (jsonRef.current && jsonRef.current.value) {
            try {
                if (JSON.parse(jsonRef.current.value).length === 0) {
                    alert("Please enter valid JSON");
                    return;
                }
            } catch (e) {
                alert("Please enter valid JSON");
                return;
            }
            setRawJson(jsonRef.current.value);
            onGenerate(jsonRef.current.value);
        }
        setStep(2);
    };

    const handlePreviousStep = () => {
        setStep(1);
    };

    const onGenerate = (json: string) => {
        setRawJson(json);
        if (!json) {
            return;
        }
        try {
            let data = JSON.parse(json);
            const cols = generateColumnsFromJson(data,colPropOverrides,colProps);
            setColumns([...additionalColumns, ...cols]);
            setDataProvider(data);
            setGridProps([...gridProps]);
        } catch (e) {
            alert("Please enter valid JSON");
            return;
        }
    };


    const writeProperty = (obj: any) => {
        if (Object.keys(obj).length === 0)
            return "";
        return `${Object.keys(obj).map((k) => {

            return typeof (obj[k]) !== "object" ?
                `
                            ${k}:${addQuotes(obj[k])}` :
                Object.keys(obj[k]).length === 0
                    ? undefined :

                    `
                            ${k}:{
                                ${Object.keys(obj[k]).map((k2) => {
                        return `
                                        ${k2}:${addQuotes(obj[k][k2])}`;
                    }
                    ).join(",")
                    }
                            }`;
        }).filter(f => f).join(",")}`;
    };
    const addQuotes = (value: any) => {
        if (value === "\"true\"")
            return "true";
        else if (value === "\"false\"")
            return "false";
        else if (value === "\"indeterminate\"")
            return "undefined";
        else if (parseInt(value) === value)
            return value;
        else if (value.toString().indexOf(".") > 0)
            return value;
        return `"${value}"`;
    };

    const getLambdaGenieConfig = () => `
    ${JSON.stringify(columns, (key, value) => {
        if (key === 'filterComboBoxDataProvider') {
            return undefined; // skip this field
        }
        return value;
    }, 2)}
    `;
    const getCode = () => `
    import { createColumn, createEditBehavior, createFilterBehavior, FilterOperation, createSelectionColumn, createDragColumn } from "@ezgrid/grid-core";
    import { createDateFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, ReactDataGrid, createDeleteColumn, SelectionCheckBoxRenderer, SelectionCheckBoxHeaderRenderer } from "@ezgrid/grid-react";
    import "@ezgrid/grid-core/styles.css"
    import "@ezgrid/grid-core/icons.css"
    import * as React from "react"
    //import { createExcelBehavior, createPdfBehavior } from "@ezgrid/grid-export"; //only needed if you are using export. Please see https://reactdatagrid.com/docs/tutorial-basics/pdf-excel for more details  
    //import { muiAdapter } from "../adapters/material-adapter"; //only needed if you are using material-ui              
    
    export default function App() {
        const gridOptions = useMemo<GridOptions>(() => ({
            dataProvider: [],//TODO - please replace this with your data provider
            uniqueIdentifierOptions: {
                useIndex: true,//TODO - please replace this with useField:"YOUR_UNIQUE_FIELD_NAME"
            },
            //adapter: muiAdapter, //only needed if you are using material-ui
            behaviors: [
                createFilterBehavior({}), //only needed if you are using filters
                createEditBehavior({}), //only needed if you are using edit
                //createPdfBehavior({}), //only needed if you are using export
                //createExcelBehavior({}), //only needed if you are using export
            ],
            columns: [${columns.find((c: ColumnOptions) => c.uniqueIdentifier === SELECTION_COL_UNIQUE_ID) ? `createSelectionColumn({
                    itemRenderer: SelectionCheckBoxRenderer,
                    headerRenderer: SelectionCheckBoxHeaderRenderer,
                }),` : ""}
                ${columns.find((c: ColumnOptions) => c.uniqueIdentifier === DRAG_COLUMN_ID) ? "createDragColumn()," : ""}
                ${columns.find((c: ColumnOptions) => c.uniqueIdentifier === DELETE_COL_UNIQUE_ID) ? `createDeleteColumn((data) => {
                    //TODO - please replace this with your delete logic
                }),` : ""}
                ${columns.filter(c => [SELECTION_COL_UNIQUE_ID, DRAG_COLUMN_ID, DELETE_COL_UNIQUE_ID].indexOf(c.uniqueIdentifier) === -1).map((c: ColumnOptions) => {
if (colPropOverrides[c.uniqueIdentifier]) {
    return `{
                            ...createColumn("${c.dataField}","${c.format}","${c.headerText}","${c.uniqueIdentifier}"),
                            filterOptions: ${getFilterOptionsString(c)},
                            ${writeProperty(colPropOverrides[c.uniqueIdentifier])}
                        }`;
} else {
    return `
                        {
                            ...createColumn("${c.dataField}","${c.format}","${c.headerText}"),
                            filterOptions: ${getFilterOptionsString(c)},
                        }`;
}
}).join(",")}
            ],${writeProperty(gridPropOverrides)}
        }), []);
        return (
            <ReactDataGrid
                style={{height:"600px"}}
                gridOptions={gridOptions}/>
        )
    }
                                                
                              `.replace(/"true"/g, "true").replace(/"false"/g, "false");
    //remove quotes around true and false
    return (
        <div style={{ width: "100%" }}>
            {
                showFormulaEditor && <CalculatedFieldEditorWrapper  allFields={columns.map(d => resolveExpression(d,"dataField")).filter(f=> f.indexOf("json")==-1)} 
                gridOptions={{adapter:muiAdapter}} />
            }
            {step === 1 && (
                <>
                    <p>
                        This tool allows you to enter some JSON data and generate a React DataGrid for it. You can also choose from some sample data below.
                        No data is sent to any server. The grid is generated entirely in the browser. This tool also does not configure any
                        styling or theming. Styling is best done using a combination of&nbsp;
                        <a target="_blank" rel="noreferrer" href="https://reactdatagrid.com/examples/?example=CSS_Styling">CSS</a>, &nbsp;
                        <a target="_blank" rel="noreferrer" href="https://reactdatagrid.com/examples/?example=Material_Demo">Theming</a>,&nbsp;and &nbsp;
                        <a target="_blank" rel="noreferrer" href="https://reactdatagrid.com/examples/?example=Cell_Formatting">Custom function call backs</a>.
                    </p>
                    <p> NOTE: This tool is in BETA testing, so please report any issues you find.
                        You can use the <a href="https://reactdatagrid.com/docs/contact">contact form</a> to report any issues.</p>
                    <TextField autoFocus margin="dense" multiline rows={10} id="json" label="Enter JSON here"
                        fullWidth variant="outlined" inputRef={jsonRef} />
                    <Stack style={{ width: "100%" }}>
                        <p style={{ textAlign: "center" }}>----OR Choose Sample Data Below-----</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: 5, width: "100%" }}>
                            <Select defaultValue="" onChange={(e) => handleSampleDataChange(e.target.value)} fullWidth label="Choose Sample Data" placeholder="Choose Sample Data">
                                <MenuItem value="0">Employee Dataset</MenuItem>
                                <MenuItem value="1">Book Dataset</MenuItem>
                                <MenuItem value="2">Hierarchical Dataset</MenuItem>
                            </Select>
                            <Button variant="contained" onClick={handleNextStep}>Next</Button>

                        </div>
                    </Stack>
                </>
            )}
            {step === 2 && (
                <div>

                    <div style={{ display: "flex", width: "100%", justifyContent: "end", gap: 2 }}>
                        <Button variant="contained" onClick={handlePreviousStep}>Back</Button>
                    </div>
                    <Tabs
                        value={tabIndex}
                        onChange={(e, v) => setTabIndex(v)}
                        aria-label="Config Tabs"
                    >
                        <Tab label="Live Preview" />
                        <Tab label="Generated Code" />
                        <Tab label="Lambda Genie Config" />
                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                        <ReactDataGrid style={{ width: "100%", height: "400px" }}
                            gridOptions={
                                {
                                    dataProvider,
                                    eventBus: {
                                        onApiContextReady: (ctx) => {
                                            apiRef.current = ctx;
                                        },
                                    },
                                    adapter: muiAdapter,
                                    behaviors: [
                                        createFilterBehavior({}),
                                        createEditBehavior({}),
                                        createPdfBehavior({}),
                                        createExcelBehavior({}),
                                    ],
                                    uniqueIdentifierOptions: {
                                        useIndex: true
                                    },
                                    ...gridPropOverrides,
                                    columns
                                }
                            }

                        />

                        <Tabs value={subTabIndex}
                            onChange={(e, v) => setSubTabIndex(v)}
                            aria-label="Config Sub Tabs">
                            <Tab label="Grid Configurations" />
                            <Tab label="Column Configuration" />
                        </Tabs>

                        <TabPanel value={subTabIndex} index={0}>

                            <ReactDataGrid style={{ width: "100%", height: "400px" }}
                                gridOptions={
                                    {
                                        dataProvider: gridProps,
                                        adapter: muiAdapter,
                                        selectionMode: GridSelectionMode.None,
                                        behaviors: [
                                            createEditBehavior({})
                                        ],
                                        uniqueIdentifierOptions: {
                                            useField: "name"
                                        },
                                        enableDynamicLevels: true,
                                        nextLevel: {
                                            childrenField: "children"
                                        },
                                        eventBus: {
                                            onApiContextReady: (ctx) => {
                                                apiRef.current = ctx;
                                                ctx.api?.expandAll();
                                            },
                                        },
                                        columns: [
                                            {
                                                ...createColumn("name", "string", "Property"),
                                                enableHierarchy: true,
                                            }, {
                                                ...createColumn("value", "string", "  "),
                                                width: 200,
                                                itemRenderer: (props) => {
                                                    const node = props.node;
                                                    const dt = node.rowPosition?.data as any;
                                                    const api = getApi(node);
                                                    if (dt.type === "button") {
                                                        let showButton = true;
                                                        if (dt.name === "Selection CheckBox" && additionalColumns.find(c => c.uniqueIdentifier === SELECTION_COL_UNIQUE_ID)) {
                                                            showButton = false;

                                                        } else if (dt.name === "Drag Column" && additionalColumns.find(c => c.uniqueIdentifier === DRAG_COLUMN_ID)) {
                                                            showButton = false;

                                                        } else if (dt.name === "Delete Column" && additionalColumns.find(c => c.uniqueIdentifier === DELETE_COL_UNIQUE_ID)) {
                                                            showButton = false;

                                                        }

                                                        return showButton ? <Button variant="outlined" onClick={() => {
                                                            if (dt.name === "Selection CheckBox") {
                                                                setAdditionalColumns([
                                                                    createSelectionColumn({
                                                                        itemRenderer: SelectionCheckBoxRenderer,
                                                                        headerRenderer: SelectionCheckBoxHeaderRenderer,
                                                                    }), ...additionalColumns]);
                                                                doPropUpdate();

                                                            } else if (dt.name === "Drag Column") {
                                                                setAdditionalColumns([createDragColumn(), ...additionalColumns]);
                                                                doPropUpdate();
                                                            } else if (dt.name === "Delete Column") {
                                                                setAdditionalColumns([createDeleteColumn((data) => {
                                                                    setDataProvider(dataProvider.filter((d: any) => d !== data));
                                                                }), ...additionalColumns]);
                                                                doPropUpdate();
                                                            }
                                                            setTimeout(() => {
                                                                api.rebuild();
                                                            }, 100);
                                                        }}>Add</Button> : null;
                                                    } else if (dt.type === "boolean") {
                                                        return <TriStateCheckBox node={node} onChange={(val) => {
                                                            dt.value = val;
                                                            setGridProps([...gridProps]);
                                                            setGridPropOverrides();
                                                        }} value={
                                                            dt.value === "true" ? CheckBoxState.CHECKED :
                                                                dt.value === "false" ? CheckBoxState.UNCHECKED :
                                                                    CheckBoxState.INDETERMINATE
                                                        } allowIndeterminate={true} />;
                                                    } else if (dt.type === "number") {
                                                        return <TextField type="number" defaultValue={dt.value || ""} onChange={debounce((e: any) => {
                                                            dt.value = e.target.value ? parseInt(e.target.value) : undefined;
                                                            setGridProps([...gridProps]);
                                                            setGridPropOverrides();
                                                        }, 600)} variant="standard" fullWidth />;
                                                    } else if (dt.type === "string") {
                                                        return <TextField variant="standard" defaultValue={dt.value} onChange={debounce((e: any) => {
                                                            dt.value = e.target.value;
                                                            setGridProps([...gridProps]);
                                                            setGridPropOverrides();
                                                        }, 600)} />;
                                                    } else if (dt.type === "enum") {
                                                        return <Select variant="standard" fullWidth value={dt.value || ""} onChange={(e) => {
                                                            dt.value = e.target.value || undefined;
                                                            setGridProps([...gridProps]);
                                                            setGridPropOverrides();
                                                        }}>
                                                            {[{ name: "Not Set", value: "" }, ...dt.options].map((ev: NameValue, idx) => {
                                                                return <MenuItem value={ev.value || ""} key={idx}>{ev.name}</MenuItem>;
                                                            })}
                                                        </Select>;
                                                    }

                                                    return null;
                                                }
                                            }
                                        ]
                                    }
                                }

                            />
                        </TabPanel>

                        <TabPanel value={subTabIndex} index={1}>
                            <ReactDataGrid style={{ width: "100%", height: "400px" }}
                                gridOptions={
                                    {
                                        dataProvider: columns,
                                        adapter: muiAdapter,
                                        selectionMode: GridSelectionMode.None,
                                        behaviors: [
                                            createEditBehavior({})
                                        ],
                                        toolbarOptions :{
                                            leftToolbarRenderer: () => {
                                                return <Button variant="outlined" onClick={() => {
                                                    setShowFormulaEditor(true);
                                                }}>Formula Editor</Button>;
                                            }
                                        },
                                        uniqueIdentifierOptions: {
                                            useField: "uniqueIdentifier"
                                        },
                                        columns: [
                                            {
                                                ...createDeleteColumn((col) => { setColumns(columns.filter(c => c.uniqueIdentifier !== (col as ColumnOptions).uniqueIdentifier)); }),
                                                lockMode: LockMode.Left,
                                            },
                                            {
                                                ...createColumn("uniqueIdentifier", "string", "Unique Identifier"),
                                                lockMode: LockMode.Left,
                                            },
                                            createColumn("dataField", "string", "Data Field"),
                                            createColumn("headerText", "string", "Header Text"),                                            
                                            ...colProps.map(p => {
                                                const colPropToColumn = (prop: GridProperty, parent: ColumnOptions | null = null, parentProperty: GridProperty | null) => {
                                                    const col = createColumn(`${parent ? parent.dataField + "." : ""}${prop.name}`, "string", prop.name);
                                                    if (prop.children) {
                                                        col.children = prop.children.map((child) => colPropToColumn(child, col, prop));
                                                    }
                                                    if (prop.type === "boolean") {
                                                        col.width = 75;
                                                        col.textAlign = "center";
                                                    } else {
                                                        col.width = 150;
                                                    }
                                                    col.itemRenderer = (props) => {
                                                        const api = getApi(props.node);
                                                        return <ConfigRenderer colPropOverrides={colPropOverrides} {...props} property={prop} parentProperty={parentProperty} onChange={
                                                            (config: GridProperty) => {
                                                                api.repaint();
                                                                doPropUpdate();
                                                            }} />;
                                                    };
                                                    return col;
                                                };
                                                return colPropToColumn(p, null, null);
                                            }),

                                        ]
                                    }
                                }

                            />
                        </TabPanel>


                    </TabPanel>

                    <TabPanel value={tabIndex} index={1}>
                        <Typography>
                            Below is the code you can copy and paste into your project to get the grid you have configured in the previous tabs.
                            <br />
                            Note that the tool does not support all the properties of the grid, for example, event listeners, function callbacks,
                            and some of the more advanced properties. The JSON below is just a starting point.
                            There is extensive documentation on the grid properties
                            <a href="https://reactdatagrid.com/docs/intro" target="_blank" rel="noreferrer"> here</a>.
                            <br />



                        </Typography>
                        <Button variant="outlined"
                            onClick={() => {
                                pasteToClipboard(getCode());
                            }}

                        >Copy To Clipboard</Button>
                        <SyntaxHighlighter language="javascript" style={dark} wrapLongLines customStyle={{ width: "100%" }}>
                            {
                                getCode()
                            }
                        </SyntaxHighlighter>


                    </TabPanel>

                    <TabPanel value={tabIndex} index={2}>
                        <Typography>
                            Below is the code you can copy and paste into Lambda Genie
                            <br />
                            Note that the tool does not support all the properties of the grid, for example, event listeners, function callbacks,
                            and some of the more advanced properties. There is extensive documentation on the grid properties
                            <a href="https://reactdatagrid.com/docs/intro" target="_blank" rel="noreferrer"> here</a>.
                            <br />
                        </Typography>
                        <Button variant="outlined"
                            onClick={() => {
                                pasteToClipboard(getLambdaGenieConfig());
                            }}

                        >Copy To Clipboard</Button>
                        <SyntaxHighlighter language="javascript" style={dark} wrapLongLines customStyle={{ width: "100%" }}>
                            {
                                getLambdaGenieConfig()
                            }
                        </SyntaxHighlighter>


                    </TabPanel>
                </div>

            )}
        </div>
    );
};
