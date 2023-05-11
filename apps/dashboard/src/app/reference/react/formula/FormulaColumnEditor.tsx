import { Box, ColumnOptions, GridIconButton, GridOptions, GridSelectionMode, RendererProps, createColumn, getApi, getRectFromDom, gridCSSPrefix } from "@ezgrid/grid-core";
import { FC, useEffect, useMemo, useState } from "react";
import { GRID_PROPS, Popup, PopupButton, buttonCreator, createDeleteColumn } from "../shared";
import { CalculatedFieldEditor } from "../filters";
import { createTextField } from "../adapter";
import { ReactDataGrid } from "../ReactDataGrid";


export interface FormulaColumnProps extends RendererProps {
}
export const FormulaColumnEditor: FC<FormulaColumnProps> = ({ node }) => {
    const api = getApi(node);
    const ctx = api.getContext();
    const gridOptions = node.gridOptions;
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
    const [formulaCol, setFormulaCol] = useState<ColumnOptions>({
        uniqueIdentifier: "",
        headerText: "",
        dataField: "",
    });

    const [rectangle, setRectangle] = useState<Box>();

    const setBoundingRect = () => {
        const rect = getRectFromDom(api.getGridBox(true));
        if (rect) {
            setRectangle(rect);
        }
    };
    const cols = api.getFlatColumnsAtAllLevels();
    const allValues = (cols?.map(col => col.dataField) || []).filter(c=> !c.startsWith("json:"));
    const [formulaColumns, setFormulaColumns] = useState<ColumnOptions[]>([]);
    useEffect(() => {
        setFormulaColumns(api.loadSettings()?.formulaColumns || []);
    }, [popupVisible]);

    const dgOptions = useMemo<GridOptions>(() => ({
        ...GRID_PROPS,
        enableToolbar: false,
        enableFilters: false,
        dataProvider:  formulaColumns,
        selectionMode: GridSelectionMode.SingleRow,
        uniqueIdentifierOptions: {
            useField: "uniqueIdentifier"
        },
        eventBus: {
            onRowSelectionChanged: (selectedRows) => {
                if(selectedRows.length > 0) {
                    const colId = selectedRows[0];
                    const col = formulaColumns.find(c => c.uniqueIdentifier === colId);
                    if(col) {
                        setFormulaCol({...col});
                        return;
                    }
                }
                setFormulaCol({
                    uniqueIdentifier: "",
                    headerText: "",
                    dataField: "",
                });
            }
        },
        columns: [
            createDeleteColumn((col) => {
                const c = col as ColumnOptions;
                if(!confirm(`Are you sure you want to delete formula column: ${c?.headerText}?`)) {
                    return;
                }
                setPopupVisible(false);
                api.flashColumn(c.uniqueIdentifier, "red");
                setTimeout(() => {
                    //give time for flash to complete
                    api.deleteFormulaColumn(c);
                }, 500);
            }),
            createColumn("headerText", "string", "Saved Formula Columns")]
    }), [formulaColumns]);
    return <><div className={gridCSSPrefix("toolbar-section")} > |
        <PopupButton node={node} popupVisible={popupVisible} setPopupVisible={togglePopup}
            trigger={<div className="ezgrid-dg-toolbar-section">{
                buttonCreator(node, "add-column-icon", "Formula Column", setBoundingRect, GridIconButton.FormulaColumn)
            }   </div>}
        />
    </div>
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={togglePopup} >
                <div className="ezgrid-dg-formula-editor" style={{ height: "100%", width: "100%", display: "flex", }}>
                    <div style={{ width: "200px", flexDirection: "column", gap: "15px", padding: "15px", display: "flex" }}>
                    <ReactDataGrid gridOptions={dgOptions} style={{ width: "200px", flex: 1 }} />
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", padding: "15px", height: "20px" }}>
                            {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false),
                                GridIconButton.Cancel, false)}
                        </div>
                        <div style={{ flexGrow: 1, padding: "20px" }}>
                            <CalculatedFieldEditor allFields={allValues} onFormulaChange={(f)=>{
                                setFormulaCol({...formulaCol, dataField: "json:"+f});
                            }} gridOptions={gridOptions} formula={formulaCol?.dataField ? formulaCol.dataField.substring(5) : ""} />
                            <div style={{ display: "flex", gap: "15px", flexDirection: "column", paddingTop: "15px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "15px" }}>
                                    <div>6) Column Settings </div>
                                    <div className="ezgrid-dg-toolbar-section" >
                                        {
                                            createTextField(gridOptions, {
                                                placeholder: "Unique Identifier(required)", onChange : (v) => {
                                                    setFormulaCol({...formulaCol, uniqueIdentifier: v});
                                                },
                                                value: formulaCol.uniqueIdentifier
                                            })
                                        }
                                        {
                                            createTextField(gridOptions, {
                                                placeholder: "Header text",
                                                value: formulaCol.headerText,
                                                onChange : (v) => {
                                                    setFormulaCol({...formulaCol, headerText: v});
                                                },
                                            })
                                        }
                                    </div>
                                    <div> </div>
                                    <div className="ezgrid-dg-toolbar-section" style={{ justifyContent: "center" }} >
                                        {
                                            buttonCreator({ gridOptions }, "check-icon", "Save", () => {
                                                if(!formulaCol.uniqueIdentifier || !formulaCol.headerText || !formulaCol.dataField) {
                                                    alert(`Please ensure unique identifier, header text and formula are set. Header text: ${formulaCol.headerText}, Unique Identifier: ${formulaCol.uniqueIdentifier}, Formula: ${formulaCol.dataField}`);
                                                    return;
                                                }
                                                const settings = api.loadSettings();
                                                if(!settings?.formulaColumns) {
                                                    settings.formulaColumns = [];
                                                }
                                                const col = settings.formulaColumns.find(c => c.uniqueIdentifier === formulaCol.uniqueIdentifier);
                                                if(!col) {
                                                    settings.formulaColumns.push(formulaCol);
                                                } else {
                                                    Object.assign(col, formulaCol);
                                                }
                                                api.saveSettings(settings);
                                                api.flashColumn(formulaCol.uniqueIdentifier, "blue");
                                                setFormulaColumns([...settings.formulaColumns]);
                                                setPopupVisible(false);

                                            }, GridIconButton.Apply, false, true)
                                        }
                                        {
                                            buttonCreator({ gridOptions }, "close-icon", "Cancel", async () => {
                                                setPopupVisible(false);
                                            }, GridIconButton.Cancel, false, true)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Popup>
        }
    </>;
};