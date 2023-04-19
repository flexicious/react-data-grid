import { Behaviors, Box, ColumnOptions, ColumnWidthMode, createColumn, dataToLabel, EditInfo, EditorProps, getApi, gridCSSPrefix, GridIconButton, GridSelectionMode, RendererProps, resolveExpression } from "@euxdt/grid-core";
import { createElement, FC, FunctionComponent, useEffect, useRef, useState } from "react";
import { ReactDataGrid } from "../../ReactDataGrid";
import { Popup, PopupButton } from "../../shared";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../../shared/shared-props";

export const EditMenu: FC<RendererProps> = ({ node }) => {
    const hasChanges = (node.gridOptions.contextInfo?.modifications?.editInfos?.length || 0) > 0;
    const divRef = useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [bulkEditVisible, setBulkEditVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const api = getApi(node);
    const hasEditBehavior = api.hasBehavior(Behaviors.EditBehavior);
    if(!hasEditBehavior) return null;
    const dataProvider = api.getChanges();
    const onTogglePopup = () => {
        const boundingRect = divRef.current?.getBoundingClientRect();
        if (!boundingRect) return;
        const { width, height, x, y } = boundingRect;
        const popupWidth = 750;
        const popupHeight = 400;
        const left = x < window.innerWidth / 2 ? x + width : x - popupWidth;
        setRectangle({ width: `${popupWidth}px`, height: `${popupHeight}px`, top: `${y + height + 10}px`, left: `${left}px` });
        setPopupState(!popupVisible);

    };
    const setPopupState = (visible: boolean) => {
        setPopupVisible(visible);
    };
    const onClearAllChanges = () => {
        api.clearChanges();
        setPopupVisible(false);
    };
    const getFormattedValue = (item: unknown, col: ColumnOptions) => {
        const editInfo = item as EditInfo;
        const columnIdentifier = editInfo.columnIdentifier;
        const val = resolveExpression(item, col.dataField);
        const oCol = api.getFlatColumns().find(c => c.uniqueIdentifier === columnIdentifier);
        if (!oCol) return val?.toString() || "";
        return dataToLabel(val, oCol);
    };
    const getColumnFromSelectedCells = () => {
        const selectedCells = api.getSelectedCells();
        if (selectedCells.length < 2) return null;
        const allSameColumn = selectedCells.every(c => c.columnIdentifier === selectedCells[0].columnIdentifier);
        if (!allSameColumn) return null;
        const selectedCell = selectedCells[0];
        const columnIdentifier = selectedCell.columnIdentifier;
        const oCol = api.getFlatColumns().find(c => c.uniqueIdentifier === columnIdentifier);
        if (oCol?.editOptions?.enableEdit === true)
            return oCol;
        return null;
    };
    const columnToEdit = getColumnFromSelectedCells();
    useEffect(() => {
     if(!columnToEdit && bulkEditVisible) {
        setBulkEditVisible(false);
     }
    },[columnToEdit]);
    return <><div ref={divRef} className="euxdt-dg-toolbar-section" key="settings" >
        <div onClick={onTogglePopup}>
        {hasChanges && <PopupButton node={node} className="euxdt-dg-toolbar-section" setRectangle={setRectangle} setPopupVisible={setPopupVisible} popupWidth={750}
            popupVisible={popupVisible} useMouseXY trigger={<>|{buttonCreator(node, "edit-icon", "Current Edits", () => setPopupVisible(true),
                GridIconButton.Edit)} ({dataProvider.length})</>}
        />}
        </div>
        {hasChanges && buttonCreator(node, "edit-icon", "Save Edits", api.applyChanges,
            GridIconButton.SettingsSave)}
        
        {columnToEdit && <PopupButton node={node} className="euxdt-dg-toolbar-section" setRectangle={setRectangle} setPopupVisible={setBulkEditVisible} popupWidth={400}
            popupVisible={popupVisible} useMouseXY trigger={<>|{buttonCreator(node, "bulk-edit-icon", "Bulk Edits", () => setBulkEditVisible(true),
                GridIconButton.BulkEdit)} |</>}
        />}
    </div>
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                <ReactDataGrid
                    style={{
                        width: "100%", height: "100%", borderBottom: "solid 1px #cccccc",
                    }}
                    gridOptions={{
                        ...GRID_PROPS(node, ""),
                        enableFooters: false,
                        enableFilters: false,
                        dataProvider,
                        selectionMode: GridSelectionMode.None,
                        uniqueIdentifierOptions: {
                            useIndex: true,
                        }, dividerOptions: {
                            body: true,
                        },
                        columns: [
                            createColumn("rowIdentifier", "string", "Row"),
                            createColumn("columnIdentifier", "string", "Column"),
                            {
                                ...createColumn("oldValue", "string", "Old Value"),
                                labelFunction: getFormattedValue,
                            }, {
                                ...createColumn("newValue", "string", "New Value"),
                                labelFunction: getFormattedValue,
                            },
                            {
                                ...createColumn("valid", "boolean", "Valid"),
                                widthMode: ColumnWidthMode.Fixed,
                                width: 75,
                            },
                            {
                                ...createColumn("validationMessage", "string", "Validation Message"),

                                widthMode: ColumnWidthMode.Fixed,
                                width: 200,
                                variableRowHeightOptions: {
                                    enabled: true,
                                }
                            },

                            {
                                ...createColumn("Undo", "string", "Undo"),
                                ...COL_PROPS(false),
                                widthMode: ColumnWidthMode.Fixed,
                                width: 75,
                                textAlign: "center",
                                headerOptions: {
                                    headerRenderer: ({ node }) => {
                                        return <div className={gridCSSPrefix("toolbar-section")} >
                                            {buttonCreator(node, "delete-icon", "Undo All Changes", onClearAllChanges, GridIconButton.Delete)}
                                            {buttonCreator(node, "close-icon", "Close Popup", onTogglePopup, GridIconButton.Cancel)}
                                        </div>;
                                    }
                                },
                                itemRenderer: ({ node }) => {
                                    const myApi = getApi(node);
                                    const editInfo = node.rowPosition?.data as EditInfo;
                                    const onClick = () => {
                                        api.removeChange(editInfo.rowIdentifier, editInfo.columnIdentifier);
                                        myApi.rebuild();
                                    };
                                    return <div key={`undo-${editInfo.rowIdentifier}-${editInfo.columnIdentifier}`} >
                                        {buttonCreator(node, "delete-icon", "Undo Change", onClick, GridIconButton.Delete)}
                                    </div>;
                                }
                            },
                        ]
                    }
                    }
                >
                </ReactDataGrid>

            </Popup>
        }
        {
            bulkEditVisible && columnToEdit && columnToEdit.editOptions && columnToEdit.editOptions.editorRenderer && <Popup node={node} rectangle={rectangle} setPopupVisible={setBulkEditVisible}>
                <div style={{width:"100%", }}>
                    <div className={gridCSSPrefix("toolbar-section")} style={{width:"100%", justifyContent:"flex-end"}}>
                        {buttonCreator(node, "close-icon", "Close Popup", () => setBulkEditVisible(false), GridIconButton.Cancel)}
                    </div>
                    <div className={gridCSSPrefix("toolbar-section")} style={{width:"100%", justifyContent:"center",padding:"20px"}}>
                        <div>{columnToEdit?.headerText || columnToEdit?.dataField}:</div>
                        <div style={{width:"150px"}}>{createElement(columnToEdit.editOptions.editorRenderer as FunctionComponent<EditorProps<unknown>>, {
                            node: {
                                ...node,
                                columnPosition: {
                                    column : columnToEdit,
                                    startPosition: 0,
                                    width: 0,
                                }
                            }, rowsToEdit: api.getSelectedCells().map(c => c.rowIdentifier)
                        })}</div>
                    </div>
                </div>
            </Popup>
        }

    </>;
};
