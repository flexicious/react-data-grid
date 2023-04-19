import { Box, ChartType, ColumnOptions, GridIconButton, RendererProps, createColumn, createSelectionColumn, getApi, getContext, getFlat, getRectFromDom, gridCSSPrefix } from "@euxdt/grid-core";
import { FC, ReactNode, useEffect, useState } from "react";
import { GRID_PROPS, Popup, PopupButton, buttonCreator } from "../shared";
import { ReactDataGrid } from "../ReactDataGrid";
import { SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "../selection";
import { createSelectField } from "../adapter";


export interface ChartBuilderProps extends RendererProps {
}
export const ChartBuilder: FC<ChartBuilderProps> = ({ node }) => {
    const ctx = getContext(node.gridOptions);
    const cols = getFlat<ColumnOptions>(node.gridOptions.columns || []).filter(c => !c.excludeFromSettings);
    const numericCols = cols.filter(c => c.format === "number")
    const allValues = cols?.map(col => ({ name: col.headerText, value: col.uniqueIdentifier })) || [];
    const [selectedValueColumns, setSelectedValueColumns] = useState<string[]>([]);
    const [selectedGroupColumn, setSelectedGroupColumn] = useState<string>("");
    const chartTypes = Object.keys(ChartType).map(k => ({ name: k, value: k }));
    const [selectedChartType, setSelectedChartType] = useState<ChartType>(ChartType.Line);
    const [chartVisible, setChartVisible] = useState(false);

    useEffect(() => {
        if (selectedChartType && selectedValueColumns.length > 0) {
            setChartVisible(true);
        } else {
            setChartVisible(false);
        }
    }, [selectedValueColumns.length,  selectedChartType]);

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
    const chartBuilderOptions = node.gridOptions.toolbarOptions?.filterBuilderOptions;

    const setBoundingRect = () => {
        const rect = getRectFromDom(api.getGridBox(true));
        if (rect) {
            setRectangle(rect);
        }
    };
    const chartColumns =selectedValueColumns.map(c => numericCols.find(nc => nc.uniqueIdentifier === c)).filter(c => c) as ColumnOptions[];
    const getChartOptions = () => ({
        chartType: selectedChartType,
        data: ctx.filteredDataProvider,
        chartColumns,
        chartGroupColumn: cols.find(c => c.uniqueIdentifier === selectedGroupColumn) as ColumnOptions,
        gridSize: ctx.gridSize
    });
    return <>{
        <div className={gridCSSPrefix("toolbar-section")} >
            <PopupButton node={node} popupVisible={popupVisible} setPopupVisible={togglePopup}
                trigger={<div className="euxdt-dg-toolbar-section">{
                    buttonCreator(node, "chart-builder-icon", "Filter Builder", setBoundingRect, GridIconButton.ChartBuilder)
                }   </div>}
            />
        </div>
    }

        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={togglePopup} >
                <div style={{ height: "100%", width: "100%", display: "flex" }}>
                    <div style={{ width: "250px", flexDirection: "column", gap: "15px", padding: "15px", display: "flex" }}>
                        <div>1. Choose Chart Type:</div>
                        {createSelectField(node.gridOptions, {
                            options: chartTypes, onChange: (val) => setSelectedChartType(val as ChartType), value: selectedChartType,
                        })}
                        <div>2. Choose Column for X Axis:</div>
                        {createSelectField(node.gridOptions, {
                            options: allValues, onChange: (val) => setSelectedGroupColumn(val.toString()), value: selectedGroupColumn,
                        })}
                        <div>3. Choose Columns to Chart:</div>
                        <ReactDataGrid gridOptions={{
                            ...GRID_PROPS,
                            enableToolbar: false,
                            enableFilters: false,
                            dataProvider: numericCols,
                            uniqueIdentifierOptions: {
                                useField: "uniqueIdentifier"
                            },
                            selectionOptions: {
                                initialRowSelection: selectedValueColumns
                            },
                            eventBus: {
                                onRowSelectionChanged: (e) => {
                                    setSelectedValueColumns([...e] as string[]);
                                }
                            },
                            columns: [
                                createSelectionColumn({
                                    itemRenderer: SelectionCheckBoxRenderer,
                                    headerRenderer: SelectionCheckBoxHeaderRenderer
                                }),
                                createColumn("headerText", "string", "Column")]
                        }} style={{ width: "250px", flex: 1 }} />

                    </div>
                    <div style={{ display: "flex", flexDirection:"column", flex: 1, height:"100%" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", padding: "15px", height:"20px" }}>
                            {
                                buttonCreator(node, "pdf-icon", "Export Pdf", () => node.gridOptions.chartLibraryAdapter?.downloadChart(getChartOptions()),
                                    GridIconButton.Pdf, false)
                            }
                            {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false),
                                                            GridIconButton.Cancel, false)}
                        </div>
                        <div style={{ flexGrow:1 }}>
                        {chartVisible && node.gridOptions.chartLibraryAdapter?.createChart(getChartOptions()) as ReactNode
                        }
                        </div>
                    </div>
                </div>

            </Popup>
        }
    </>;
};