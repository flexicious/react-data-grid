import { Box, createColumn, FilterOperation, FilterOptions, PopupFilterRendererProps, getApi, getFlat, gridCSSPrefix, GridIconButton, GridSelectionMode, LABELS, NameValue, RendererProps, FilterPageSortLoadMode, GridOptions } from "@ezgrid/grid-core";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { ReactDataGrid } from "../ReactDataGrid";
import { Popup, PopupButton } from "../shared/PopupButton";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../shared/shared-props";
import { Expander } from "../toolbar";

export const MultiSelectFilter: FC<PopupFilterRendererProps> = ({ node, filterBuilderMode, onValueChanged, value, popupWidth, popupHeight }) => {
    const selectedValues = useRef<string[]>([]);
    const textInputRef = useRef<HTMLInputElement>(null);
    const [popupVisible, setPopupVisibleInternal] = useState(false);
    const [loading, setLoading] = useState(false);
    const setPopupVisible = (visible: boolean) => {
        setPopupVisibleInternal(visible);
        if (visible) {
            if (node.gridOptions?.filterPageSortMode === FilterPageSortLoadMode.Server) {
                if (node.columnPosition?.column && !node.gridOptions.serverInfo?.filterDistinctValues?.[node.columnPosition.column.dataField]) {
                    const retVal = node.gridOptions.eventBus?.onFilterDistinctValuesRequested?.(node.columnPosition?.column);
                    if (retVal === true) {
                        setLoading(true);
                    }
                }
            }
        }
    };
    const divRef = useRef<HTMLDivElement>(null);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [rectangle, setRectangle] = useState<Box>();
    const [filterValue, setFilterValue] = useState<string[]>([]);
    const columnIdentifier = node.columnPosition?.column.uniqueIdentifier!;
    const isHierarchical = node.columnPosition?.column.filterOptions?.filterComboBoxBuildFromGridHierarchy;
    const api = getApi(node);
    let currentValue: string[] = [];
    if (node.columnPosition?.column.uniqueIdentifier) {
        currentValue = filterBuilderMode ? (value || []) as string[] : api.getFilterValue(columnIdentifier) as string[] || [];
    }
    const values = currentValue?.join(",") + currentValue?.length ;
    const getDataProvider = () => node.columnPosition ? api.getDistinctFilterValues(node.columnPosition.column) : [];
    const dp =getDataProvider();
    const dataProviderLength = dp.length;
        useEffect(() => {
            setLoading(false);
        }, [dataProviderLength]);
    useEffect(() => {
        const col = node.columnPosition?.column;
        if (col) {
            const dp = api.getDistinctFilterValues(col) as NameValue[];
            const flat = getFlat<NameValue>(dp);
            const labels = flat.filter((d: NameValue) => currentValue.includes((d.value ?? "").toString())).map((d: NameValue) => d.name);
            setFilterLabel(labels.join(","));
            setFilterValue(currentValue);
            selectedValues.current = (currentValue);
        }
    }, [values]);
    const cls = gridCSSPrefix;
    const clearFilter = () => {
        setFilterValue([]);
        setPopupVisible(false);
        api.setFilterValue(columnIdentifier, LABELS.ALL_LABEL);
    };
    const applyFilter = () => {
        if (!node.columnPosition?.column) return;
        const allItems = api.getDistinctFilterValues(node.columnPosition.column);
        if (selectedValues.current.length === 0 || selectedValues.current.length === allItems.length) {
            clearFilter();
            return;
        }
        setFilterValue(selectedValues.current);
        setPopupVisible(false);
        if (filterBuilderMode) {
            onValueChanged?.(selectedValues.current);
            return;
        }
        api.setFilterValue(columnIdentifier, selectedValues.current);
    };
    const dgOptions = useMemo<GridOptions>(() => ({
        ...GRID_PROPS(node, "value"),
        dataProvider: dp,
        isLoading: loading,
        selectionMode: GridSelectionMode.MultipleRows,
        selectionOptions: {
            initialRowSelection: filterValue ? [...filterValue] : [],
            enableSelectionCascade: true,
            enableSelectionBubble: true,
            sortSelectedItemsOnTop: true,
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                if(isHierarchical)
                ctx?.api?.expandOneLevel();
            },
            onRowSelectionChanged: (selectedRowIds) => {
                selectedValues.current = selectedRowIds as string[];
            }
        },
        columns: [
            {
                ...createColumn("name"),
                headerText: " All",
                enableHierarchy: isHierarchical,
                headerOptions: {
                    headerRenderer: ({ node }) => {
                        return <div className="ezgrid-dg-horizontal-flex">
                            <div style={{ float: "left" }} >
                                All
                            </div>
                            <div style={{ float: "right", display: "flex", gap: 4 }} >
                                {isHierarchical && <Expander node={node} />}
                                {!filterBuilderMode && buttonCreator(node, "delete-icon", "Clear Filter", clearFilter, GridIconButton.Delete, false)}
                                {buttonCreator(node, "check-icon", "Apply Filter", applyFilter, GridIconButton.Apply, false)}
                                {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel, false)}
                            </div>
                        </div>;
                    }
                },
                ...COL_PROPS(true)
            }
        ]
    }), [filterValue, loading,dp]);
    return <><div className={cls("toolbar-section")} style={{ width: "100%" }} ref={divRef}>
        <PopupButton node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} textInputRef={textInputRef} textInputValue={filterLabel} popupHeight={popupHeight ?? 300} popupWidth={popupWidth}
            className={cls("expandcollapseicon ezgrid-dg-arrow-down-icon")}
            boundingRect={divRef.current?.getBoundingClientRect()} />
    </div>
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                <ReactDataGrid
                    style={{ height: "calc(100% - 2px)", width: "calc(100% - 2px)", borderBottom: "solid 1px #cccccc" }}
                    gridOptions={dgOptions}
                >
                </ReactDataGrid>
            </Popup>
        }
    </>;
};
export const createMultiSelectFilterOptions = <T=unknown> ({ popupWidth, popupHeight }: { popupWidth?: number, popupHeight?: number } = {}): FilterOptions<T> => {
    return {
        filterRenderer: (props: RendererProps<T>) => <MultiSelectFilter key={props.node.key} {...props as RendererProps} popupHeight={popupHeight} popupWidth={popupWidth} />,
        filterOperation: FilterOperation.InList,
        filterComboBoxBuildFromGrid: true,
    };
};