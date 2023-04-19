import { Box, createColumn, FilterOperation, FilterOptions, getApi, gridCSSPrefix, GridIconButton, LABELS, NameValue, PopupFilterRendererProps, RendererProps } from "@euxdt/grid-core";
import { FC, useEffect, useRef, useState } from "react";
import { ReactDataGrid } from "../ReactDataGrid";
import { Popup, PopupButton } from "../shared/PopupButton";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../shared/shared-props";

export const GroupingColumnFilter: FC<PopupFilterRendererProps> = ({ node, filterBuilderMode, onValueChanged, value, popupWidth, popupHeight }) => {
    const selectedValues = useRef<Record<string, string[]>>({});
    const textInputRef = useRef<HTMLInputElement>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [rectangle, setRectangle] = useState<Box>();
    const columnIdentifier = node.columnPosition?.column.uniqueIdentifier!;

    const api = getApi(node);
    const groupingFields = api.getGroupByFields();
    let currentValue: Record<string, string[]> = {};
    if (node.columnPosition?.column.uniqueIdentifier) {
        currentValue = filterBuilderMode ? (value ||  {}) as Record<string, string[]> : api.getFilterValue(columnIdentifier) as Record<string, string[]> ||  {};
    }
    const label = Object.keys(currentValue).map((key)=> currentValue[key]).flat().join(", ");
    useEffect(() => {
        if (node.columnPosition?.column) {
            setFilterLabel(label);
        }
    }, [label]);
    const cls = gridCSSPrefix;
    const clearFilter = () => {
        setPopupVisible(false);
        api.setFilterValue(columnIdentifier, LABELS.ALL_LABEL);
    };
    const applyFilter = () => {
        if (!node.columnPosition?.column) return;
        setPopupVisible(false);
        if (filterBuilderMode) {
            onValueChanged?.(selectedValues.current);
            return;
        }
        api.setFilterValue(columnIdentifier, selectedValues.current);
    };
    return <><div className={cls("toolbar-section")} style={{ width: "100%" }} ref={divRef}>
        <PopupButton node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} textInputRef={textInputRef} textInputValue={filterLabel} popupHeight={popupHeight ?? 300} popupWidth={popupWidth ?? groupingFields.length * 200}
            className={cls("expandcollapseicon euxdt-dg-arrow-down-icon")}
            boundingRect={divRef.current?.getBoundingClientRect()} />
    </div>
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 20px)", padding: "10px", gap: "10px" }}>
                    <div className="euxdt-dg-horizontal-flex" style={{ justifyContent: "end" }}>
                        {!filterBuilderMode && buttonCreator(node, "delete-icon", "Clear Filter", clearFilter, GridIconButton.Delete, false)}
                        {buttonCreator(node, "check-icon", "Apply Filter", applyFilter, GridIconButton.Apply, false)}
                        {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel, false)}
                    </div>
                    <div className="euxdt-dg-horizontal-flex" style={{ height: "100%", flex: 1, gap: "10px" }}>
                        {
                            groupingFields.map((field, i) => {
                                const col = api.getColumn(field.value);
                                if (!col) return null;
                                const dp = api.getDistinctFilterValues(col) as NameValue[];
                                const mySelectedValues = currentValue[field.value] || [];
                                return <ReactDataGrid key={i}
                                    style={{ width: "100%", height: "100%" }}
                                    gridOptions={{
                                        ...GRID_PROPS(node, "value"),
                                        dataProvider: dp,
                                        selectionOptions: {
                                            initialRowSelection: mySelectedValues,
                                        },
                                        eventBus: {
                                            onRowSelectionChanged: (selectedRowIds) => {
                                                if (!selectedValues.current[field.value])
                                                    selectedValues.current[field.value] = [];
                                                selectedValues.current[field.value] = selectedRowIds as string[];
                                            }
                                        },
                                        columns: [
                                            {
                                                ...createColumn("name"),
                                                headerText: " All",
                                                headerOptions: {
                                                    headerRenderer: ({ node }) => {
                                                        return <div className="euxdt-dg-horizontal-flex">
                                                            <div style={{ float: "left" }} >
                                                                All ({field.name})
                                                            </div>
                                                        </div>;
                                                    }
                                                },
                                                ...COL_PROPS(true)
                                            }
                                        ]
                                    }}
                                >

                                </ReactDataGrid>;
                            })
                        }

                    </div>
                </div>
            </Popup>
        }
    </>;
};
export const createGroupingColumnFilterOptions = ({popupWidth,popupHeight}:{popupWidth?: number,popupHeight?: number} = {}): FilterOptions => {
    return {
        filterRenderer: (props: RendererProps) => <GroupingColumnFilter key={props.node.key} {...props} popupWidth={popupWidth} popupHeight={popupHeight} />,
        filterOperation: FilterOperation.InList,
        filterComboBoxBuildFromGrid: true,
    };
};