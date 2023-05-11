
import { ApiContext, GridOptions, GridSelectionMode, NameValue, RendererProps, createColumn, getApi, getColumnSelectEditorOptions, gridCSSPrefix } from "@ezgrid/grid-core";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { ReactDataGrid } from "../ReactDataGrid";
import { COL_PROPS, GRID_PROPS } from "../shared/shared-props";

export const AutoCompelte: FC<RendererProps> = ({ node }) => {
    const apiRef = useRef<ApiContext | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const api = getApi(node);
    const ctx = api.getContext();
    const ac = ctx?.autoCompleteContext;
    if(!ac) return null;
    if(!ac.column) return null;
    const {x,y,width,column,searchText,rowIds} = ac;
    if (!column) return null;
    const filteredDp = getColumnSelectEditorOptions(column,node.gridOptions).filter((item) => (item as NameValue).name.toLowerCase().startsWith(searchText.toLowerCase()));
    const dataProviderLength = filteredDp.length;
    const [dataProvider, setDataProvider] = useState<unknown[]>([]);
    useEffect(() => {
        setLoading(false);
        const firstItem = filteredDp.length > 0 ? filteredDp[0] : null;
        setDataProvider([...filteredDp])
        ac.selectedText = firstItem ? (firstItem as NameValue).name : "";
        setSelectedRowId(ac.selectedText);
        apiRef.current?.api?.setSelectedCells([{columnIdentifier:"name",rowIdentifier:ac.selectedText}]);
        if(dataProviderLength === 0) {
            api.hideAutoComplete();
            api.focus();
            
        }
    }, [dataProviderLength]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key === "Enter" || e.key === "Tab"){
            const colPosition = api.getColumnPosition(column.uniqueIdentifier);
            for(const rowId of rowIds){
                const rowPosition = api.getRowPosition(String(rowId));
                if(rowPosition && colPosition && selectedRowId){
                    const eo=api.addChange(rowPosition,colPosition,selectedRowId);
                    if(eo)
                    api.validateValue(eo,column,true);
                }
            }
            api.hideAutoComplete();
            api.focus();
        }
    };
    const cls = gridCSSPrefix;
    const gridOptions = useMemo<GridOptions>(() => ({
        focusOnMount: true,
        ...GRID_PROPS(node, "value"),
        dataProvider,
        enableFilters: false,
        enableHeaders: false,
        enableFooters: true,
        footerRowHeight:20,
        isLoading: loading,
        selectionMode: GridSelectionMode.SingleCell,
        selectionOptions: {
            initialCellSelection:[
                {
                    columnIdentifier: "name",
                    rowIdentifier: selectedRowId || ""
                }
            ]
        },
        eventBus: {
            onApiContextReady: (api) => {
                apiRef.current = api;
            },
            onCellSelectionChanged: (selection) => {
                if (selection.length > 0) {
                    const selecetdCell = selection[0];
                    setSelectedRowId(selecetdCell.rowIdentifier);
                    ac.selectedText = selecetdCell.rowIdentifier
                }
            }
        },
        columns: [
            {
                ...createColumn("name"),
                ...COL_PROPS(false),
                footerOptions:{
                    footerRenderer:({node})=> {
                        return <div className={cls("toolbar-section")} ><a style={{ right:"2px",position:"absolute"}} href="#" onClick={(e)=>{e.preventDefault();api.hideAutoComplete();}}>
                        Cancel</a></div>
                    }
                }
            }
        ]
    }), [dataProvider, loading, selectedRowId]);
    return <div className={cls("auto-complete")} style={{ left: x, top: y }} onKeyDown={handleKeyDown} >
                {selectedRowId&&
                    <ReactDataGrid
                    style={{ height: "200px", width: (width||"200")+"px", borderBottom: "solid 1px #cccccc" }}
                    
                    gridOptions={gridOptions}
                >
                </ReactDataGrid>
                }
            </div>
};
export const AutoCompelteRenderer = (props: RendererProps) => <AutoCompelte key={props.node.key} {...props} />;