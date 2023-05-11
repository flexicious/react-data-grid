import { ApiContext, Box, ChartProps, ChartSetting, ChartType, ColumnOptions, GridIconButton, GridOptions, HorizontalScrollMode, LABELS, RendererProps, createColumn, createSelectionColumn, getApi, getContext, getFlat, getRectFromDom, gridCSSPrefix, loadSettings } from "@ezgrid/grid-core";
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { GRID_PROPS, Popup, PopupButton, buttonCreator } from "../shared";
import { ReactDataGrid } from "../ReactDataGrid";
import {  SelectionCheckBoxRenderer } from "../selection";
import { createCheckBox, createSelectField } from "../adapter";
import { SaveSettingPopup } from "../toolbar/settings/SaveSettingPopup";
import { ManageSettingsGrid } from "../toolbar/settings/ManageSettingsGrid";


export interface ChartBuilderProps extends RendererProps {
}
export const ChartBuilder: FC<ChartBuilderProps> = ({ node }) => {
    const cols = getFlat<ColumnOptions>(node.gridOptions.columns || []).filter(c => !c.excludeFromSettings);
    const numericCols = cols.filter(c => c.format === "number" || c.format === "currency");
    const allValues = cols?.map(col => ({ name: col.headerText, value: col.uniqueIdentifier })) || [];
    const [selectedValueColumns, setSelectedValueColumns] = useState<string[]>([]);
    const [selectedGroupColumn, setSelectedGroupColumn] = useState<string>("");
    const chartBuilderOptions = node.gridOptions.toolbarOptions?.chartBuilderOptions;
    const chartTypes = chartBuilderOptions?.chartTypes?.map(k => ({ name: k, value: k })) ?? Object.keys(ChartType).map(k => ({ name: k, value: k }))
    const [selectedChartType, setSelectedChartType] = useState<ChartType>(ChartType.Line);
    const [chartVisible, setChartVisible] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(true);
    const [pickerDataProvider, setPickerDataProvider] = useState<ColumnOptions[]>(numericCols);
    const [enableGrouping, setEnableGrouping] = useState(false);
    const [manageSettingsVisible, setManageSettingsVisible] = useState(false);
    const apiRef = useRef<ApiContext | null>(null);
    const [savedChartSettings, setSavedChartSettings] = useState<ChartSetting[]>([]);

    useEffect(() => {
        const settings = loadSettings(node.gridOptions)?.chartSettings || [];
        setSavedChartSettings(settings);
        const defaultSetting = settings.find(s => s.name ===( node.gridOptions.settingsOptions?.defaultSettingsName || LABELS.DEFAULT_SETTINGS_NAME));
        if (defaultSetting) {
            applyChart(defaultSetting);
        }
    },[]);
    useEffect(() => {
        if (selectedChartType && selectedValueColumns.length > 0) {
            setChartVisible(true);
        } else {
            setChartVisible(false);
        }
    }, [selectedValueColumns.length, selectedChartType]);

    const api = getApi(node);
    const [popupVisible, setPopupVisibleInner] = useState(false);
    const setPopupVisible = (val: boolean) => {
        if (val) {
            api.suspendMouseEvents();
        } else {
            api.resumeMouseEvents();
        }
        setPopupVisibleInner(val);
    };
    const togglePopup = (val: boolean) => {
        setPopupVisible(val);
    };

    const [rectangle, setRectangle] = useState<Box>();
    const [settingsRectangle, setSettingsRectangle] = useState<Box>();
    useEffect(() => {
        if (rectangle) {
            setSettingsRectangle({ width: "250px", height: rectangle.height, top: rectangle.top, left: `${parseInt(rectangle.left || "0") + parseInt(rectangle.width||"0") - 300}px` });
        }


    }, [rectangle]);

    const setBoundingRect = () => {
        const rect = getRectFromDom(api.getBodyBox(20));
        if (rect) {
            setRectangle(rect);
        }
    };
    const chartColumns = selectedValueColumns.map(c => numericCols.find(nc => nc.uniqueIdentifier === c)).filter(c => c) as ColumnOptions[];
    const getChartOptions = (): ChartProps => ({
        chartType: selectedChartType,
        data: enableGrouping && selectedGroupColumn ? api.getGroupedDataProvider(api.getFilteredDataFlat(), [selectedGroupColumn]).groupedData
         :  api.getFilteredDataFlat(),
        chartColumns,
        chartGroupColumn: cols.find(c => c.uniqueIdentifier === selectedGroupColumn) as ColumnOptions,
        chartSize: { width: parseInt(rectangle?.width || "800") - 300, height: parseInt(rectangle?.height || "600") - 100 },
    });
    const togglePicker = () => {
        setPickerVisible(!pickerVisible);
        setPickerDataProvider([...pickerDataProvider]);
    }
    const onSaveChartSettings = (settingName:string) => {
        if (settingName && selectedChartType && selectedValueColumns.length > 0 && selectedGroupColumn) {
            const settings = api.loadSettings();
            settings.chartSettings = settings.chartSettings || [];
            const newSetting ={
                name:settingName,
                chartType : selectedChartType, 
                categoryField: selectedGroupColumn,
                seriesFields: selectedValueColumns,
                enableGrouping
            };
            if(settings.chartSettings.find(s => s.name === settingName)){
                settings.chartSettings = settings.chartSettings.filter(s => s.name !== settingName);
            }
            settings.chartSettings.push(newSetting);
            api.saveSettings(settings);
            setSavedChartSettings([...settings.chartSettings]);
        } else {
            alert(`Please enter a setting name, chart type, group column and value columns.
            Provided values: ${settingName}, ${selectedChartType}, ${selectedGroupColumn}, ${selectedValueColumns}
            `);
        }
    };
    const applyChart = (settings: ChartSetting) => {
        setSelectedChartType(settings.chartType);
        setSelectedGroupColumn(settings.categoryField);
        setSelectedValueColumns(settings.seriesFields);
        apiRef.current?.api?.setSelectedRows(settings.seriesFields);
        setEnableGrouping(settings.enableGrouping || false);
        setPickerDataProvider([...pickerDataProvider]);
    };
    const deleteChartSetting = (settings: ChartSetting) => {
        const s = api.loadSettings();
        s.chartSettings = s.chartSettings!.filter(s => s.name !== settings.name);
        api.saveSettings(s);
        setSavedChartSettings([...s.chartSettings]);
    };
    const gridOptions = useMemo<GridOptions>(() => ({
        ...GRID_PROPS,
        enableToolbar: true,
        toolbarOptions: {
            toolbarRenderer: () => <div className="ezgrid-dg-toolbar-section" style={{justifyContent:"space-between", height:"50px"}}>
                <div  style={{padding:"5px"}}>{
                    selectedValueColumns.map((c, index) => {
                        const col = pickerDataProvider.find(nc => nc.uniqueIdentifier === c);
                        return col?.headerText || "";
                    }).join(", ")
        }</div>
                {pickerVisible?
buttonCreator(node, "collapse-all-icon", "Hide Picker", togglePicker , GridIconButton.CollapseOne)
: buttonCreator(node, "expand-all-icon", "Show Picker", togglePicker , GridIconButton.ExpandOne)}
                </div>
        },
        enableHeaders: false,
        enableFilters: false,
        enableFooters: false,
        dataProvider: pickerDataProvider,
        uniqueIdentifierOptions: {
            useField: "uniqueIdentifier"
        },
        selectionOptions: {
            initialRowSelection: selectedValueColumns
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            },
            onRowSelectionChanged: (e) => {
                setSelectedValueColumns([...e] as string[]);
            }
        },
        columns: [
            createSelectionColumn({
                itemRenderer: SelectionCheckBoxRenderer,
                headerRenderer: ()=><div/>,
            }),
            createColumn("headerText", "string", "Column")]
    }), [selectedValueColumns, pickerVisible]);
    return <>{
        <div className={gridCSSPrefix("toolbar-section")} > |
            <PopupButton node={node} popupVisible={popupVisible} setPopupVisible={togglePopup}
                trigger={<div className="ezgrid-dg-toolbar-section">{
                    buttonCreator(node, "add-chart-icon", "Chart Builder", setBoundingRect, GridIconButton.ChartBuilder)
                }   </div>}
            />
        </div>
    }
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={togglePopup} makeBackground={false} >
                <div className="ezgrid-dg-chart-builder" style={{ height: "100%", width: "100%", display: "flex" }}>
                    <div style={{ width: "250px", flexDirection: "column", gap: "15px", padding: "15px", display: "flex" }}>
                        <div>1. Choose Chart Type:</div>
                        {createSelectField(node.gridOptions, {
                            options: chartTypes, onChange: (val) => setSelectedChartType(val as ChartType), value: selectedChartType,
                        })}
                        <div>2. Choose Column for Category Axis:</div>
                        {createSelectField(node.gridOptions, {
                            options: allValues, onChange: (val) => setSelectedGroupColumn(val.toString()), value: selectedGroupColumn,
                        })}
                        <div>3. Choose Columns for Value Axis:</div>
                        <ReactDataGrid gridOptions={gridOptions} style={{ width: "250px", height: pickerVisible? "250px" :"50px", minHeight:"50px"}} />

                        <div>4. Enable Grouping (optional):
                        {
                            createCheckBox(node.gridOptions, {
                                onChange: (val) => setEnableGrouping(val),
                                value: enableGrouping,
                            })
                        }
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", padding: "15px", height: "20px", alignItems:"center" }}>
                                
                            {node.gridOptions.settingsOptions?.settingsStorageKey
                                && <SaveSettingPopup node={node} onSaveSetting={onSaveChartSettings}/>}
                            {savedChartSettings?.length > 0 &&
                            <PopupButton node={node} popupVisible={manageSettingsVisible} setPopupVisible={setManageSettingsVisible}
                                trigger={buttonCreator(node, "manage-settings-icon", "Manage Chart Settings", setBoundingRect, GridIconButton.SettingsManage)}
                            />}
                            {manageSettingsVisible && <Popup node={node} rectangle={settingsRectangle} setPopupVisible={setManageSettingsVisible}>
                            <ManageSettingsGrid node={node} setPopupState={setManageSettingsVisible} getSettings={()=>loadSettings(node.gridOptions)?.chartSettings || []}
                                applySetting={(settings) => applyChart(settings as ChartSetting)} 
                                deleteSetting={ (settings) => deleteChartSetting(settings as ChartSetting)}
                            />
                            </Popup>
                            }
                            {
                                buttonCreator(node, "export-pdf-icon", "Export Pdf", () => node.gridOptions.chartLibraryAdapter?.downloadChart(getChartOptions()),
                                    GridIconButton.Pdf, false)
                            }
                            {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false),
                                GridIconButton.Cancel, false)}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            {chartVisible && node.gridOptions.chartLibraryAdapter?.createChart(getChartOptions()) as ReactNode
                            }
                        </div>
                    </div>
                </div>

            </Popup>
        }
    </>;
};