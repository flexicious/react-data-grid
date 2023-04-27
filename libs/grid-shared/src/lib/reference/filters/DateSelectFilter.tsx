import { LABELS, Box, ColumnOptions, createColumn, GRID_CONSTANTS, dateAdd, DatePart, DateRangeType, FilterOperation, FilterOptions, FilterRendererProps, getApi, getDateRange, getDateRangeTypeNameValues, gridCSSPrefix, GridIconButton, GridSection, GridSelectionMode, NameValue, RangeFilterSelection, RendererProps, stopPropagation } from "@ezgrid/grid-core";
import { FC, useEffect, useRef, useState } from "react";
import { createDateField } from "../adapter";
import { ReactDataGrid } from "../ReactDataGrid";
import { Popup, PopupButton } from "../shared/PopupButton";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../shared/shared-props";

export const DateSelectFilter: FC<FilterRendererProps> = ({ node, filterBuilderMode, onValueChanged, value }) => {
    const [options, setOptions] = useState<NameValue[]>([]);
    const startDate = useRef<Date | null | undefined>(dateAdd(DatePart.MONTH, -1, new Date()));
    const endDate = useRef<Date | null | undefined>(new Date());
    const textInputRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const api = getApi(node);
    let currentValue: RangeFilterSelection | undefined = undefined;
    const gridSelection = useRef<string | undefined>(undefined);
    const columnIdentifier = node.columnPosition?.column.uniqueIdentifier!;
    const dateOptions = node.columnPosition?.column.filterOptions?.filterDateRangeOptions || Object.values(DateRangeType);
    if (node.columnPosition?.column.uniqueIdentifier) {
        currentValue = (filterBuilderMode ? value : api.getFilterValue(columnIdentifier)) as RangeFilterSelection;
    }
    const clearFilter = () => {
        setPopupVisible(false);
        if (filterBuilderMode) {
            onValueChanged?.(undefined);
            return;
        }
        api.clearFilterValue(columnIdentifier);
    };
    useEffect(() => {
        if (node.columnPosition?.column.uniqueIdentifier) {
            const allDateRanges = getDateRangeTypeNameValues();
            const dateOptionsNameValues: NameValue[] = [];
            dateOptions.forEach((option) => {
                const stockDateRange = allDateRanges.find(nv => (option.toString()) === nv.value);
                if (stockDateRange) {
                    dateOptionsNameValues.push(stockDateRange);
                } else if ((option as { type: string }).type) {
                    dateOptionsNameValues.push({ name: (option as { type: string }).type, value: (option as { type: string }).type });
                }
            });
            setOptions([{ name: LABELS.ALL_LABEL, value: LABELS.ALL_LABEL }, ...dateOptionsNameValues]);
            if (currentValue?.type === DateRangeType.Custom) {
                startDate.current = (currentValue.start);
                endDate.current = (currentValue.end);
            }
        }
    }, [currentValue?.type,]);

    const applyFilter = () => {
        const selectedVal = gridSelection.current;
        const value = getDateRangeFromValue(selectedVal);
        if (value) {
            if (filterBuilderMode) {
                onValueChanged?.(value);
            } else {
                api.setFilterValue(columnIdentifier, value);
            }
        }
        setPopupVisible(false);
    };
    const getDateRangeFromValue = (selectedVal: string | undefined) => {
        let
            value: string | { start: Date, end: Date, type: DateRangeType } = "";
        if (selectedVal === LABELS.ALL_LABEL) {
            value = LABELS.ALL_LABEL;
        } else if (selectedVal === DateRangeType.Custom) {
            if (startDate && endDate && startDate <= endDate) {
                const start = typeof startDate.current === "string" ? new Date(startDate.current) : startDate.current;
                const end = typeof endDate.current === "string" ? new Date(endDate.current) : endDate.current;
                value = { start: start || dateAdd(DatePart.MONTH, -1, new Date()), end: end || new Date(), type: DateRangeType.Custom };
            }
        } else if (Object.values(DateRangeType).includes(selectedVal as DateRangeType)) {
            value = getDateRange(selectedVal as DateRangeType);
        } else if (dateOptions.find((d: any) => d.type === selectedVal)) {
            const option = dateOptions.find((d: any) => d.type === selectedVal) as { start: Date, end: Date, type: DateRangeType };
            value = { start: option.start, end: option.end, type: option.type };
        }
        return value;
    };


    return <><div className={gridCSSPrefix("toolbar-section")} style={{ width: "100%" }} ref={divRef}>
        <PopupButton node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} textInputRef={textInputRef} popupHeight={300} 
            className={gridCSSPrefix("expandcollapseicon ezgrid-dg-arrow-down-icon")}
            boundingRect={divRef.current?.getBoundingClientRect()} 
            textInputValue={currentValue?.type || LABELS.ALL_LABEL}
            />
    </div>
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                <ReactDataGrid
                    style={{height: "calc(100% - 2px)", width: "calc(100% - 2px)", borderBottom: "solid 1px #cccccc" }}
                    gridOptions={{
                        ...GRID_PROPS(node, "value"),
                        enableToolbar: true,
                        enableFilters: false,
                        toolbarHeight: 80,
                        dividerOptions: {
                            header: true,
                            toolbar: true,
                        },
                        displayOrder: [GridSection.Header, GridSection.Filter, GridSection.Body, GridSection.Toolbar],
                        toolbarOptions: {
                            toolbarRenderer: ({ node }) => {
                                const { box, styles } = node;
                                const api = getApi(node);
                                return <div key={node.key} className={`${GRID_CONSTANTS.CSS_PREFIX}toolbar`}
                                    style={{ ...box, ...styles }} onMouseEnter={stopPropagation} onMouseLeave={stopPropagation} onClick={stopPropagation}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", padding: 4, gap: 4 }}>
                                        <div className={gridCSSPrefix("toolbar-section")} >From:</div>
                                        {createDateField(node.gridOptions, { onChange: (newVal) => {startDate.current = newVal;api.repaint(); }, value: startDate.current })}
                                        <div className={gridCSSPrefix("toolbar-section")} >To:</div>
                                        {createDateField(node.gridOptions, { onChange: (newVal) => {endDate.current = newVal; api.repaint();}, value: endDate.current })}
                                    </div>
                                </div>;
                            }
                        },
                        dataProvider: options,
                        selectionMode: GridSelectionMode.SingleRow,
                        selectionOptions: {
                            initialRowSelection: currentValue ? [currentValue.type] : [LABELS.ALL_LABEL],
                        },
                        eventBus: {
                            onRowSelectionChanged: (selectedRowIds) => {
                                gridSelection.current = selectedRowIds.length > 0 ? String(selectedRowIds[0]) : undefined;
                                const value = getDateRangeFromValue(gridSelection.current);
                                if (typeof value !== "string") {
                                    startDate.current = (value.start);
                                    endDate.current = (value.end);
                                }
                                setOptions([...options]);
                            }
                        },
                        columns: [
                            {
                                ...createColumn("value"),
                                headerText: "Date Range",
                                headerOptions: {
                                    headerRenderer: ({ node }) => {
                                        return <div className={gridCSSPrefix("toolbar-section")} style={{ justifyContent: "space-between", width: "100%" }}
                                        >
                                            <div  >
                                                Date Range
                                            </div>
                                            <div className={gridCSSPrefix("toolbar-section")} >
                                                {!filterBuilderMode && buttonCreator(node, "delete-icon", "Clear Filter", clearFilter, GridIconButton.Delete, false)}
                                                {buttonCreator(node, "check-icon", "Apply Filter", applyFilter, GridIconButton.Apply, false)}
                                                {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel, false)}
                                            </div>
                                        </div>;
                                    }
                                },
                                ...COL_PROPS(false)
                            }
                        ]
                    }
                    }
                >
                </ReactDataGrid>
            </Popup>
        }
    </>;
};
const DateSelectFilterRenderer = (props: RendererProps) => <DateSelectFilter key={props.node.key} {...props} />;
const filterDeserializerFunction = (col: ColumnOptions, input: unknown): { start: Date, end: Date, type: DateRangeType } => {
    const value = input as { start: Date, end: Date, type: DateRangeType };
    if (value.type) {
        return {
            start: new Date(value.start),
            end: new Date(value.end),
            type: value.type
        };
    }
    return value;
};
export const createDateFilterOptions = (ranges?: (DateRangeType | { type: string, start: Date, end: Date })[]): FilterOptions => {
    return {
        filterRenderer: DateSelectFilterRenderer,
        filterDateRangeOptions: ranges,
        filterOperation: FilterOperation.Between,
        filterDeserializerFunction
    };
};