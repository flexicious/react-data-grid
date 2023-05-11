import { Box, ColumnWidthMode, createColumn, getApi, GridIconButton, GridOptions, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { FC, useMemo, useState } from "react";
import { ReactDataGrid } from "../ReactDataGrid";
import { Popup, PopupButton } from "../shared/PopupButton";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../shared/shared-props";
export const FilterChips: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const filterValues = api.getAllFilterValues() || {};
    const [popupVisible, setPopupVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const getHeaderText = (key: string) => {
        const column = node.gridOptions.contextInfo?.flatColumns.find(c => c.uniqueIdentifier === key);
        return column?.headerText || key;
    };
    const filterChips = Array.from(filterValues.entries()).map(([key, filterValue]) => {
        if (filterValue !== undefined && filterValue !== null && filterValue !== "") {
            const column = node.gridOptions.contextInfo?.flatColumns.find(c => c.uniqueIdentifier === key);
            return {
                title: api.getFilterDisplayValue(filterValue, column),
                name: getHeaderText(key),
                key
            };
        }
        return undefined;
    }).filter(f => f !== undefined);
    const gridOptions = useMemo<GridOptions>(() => ({
        dataProvider: filterChips,
        ...GRID_PROPS(node, "key"), dividerOptions: {
            body: true,
        },
        enableFilters: false,
        columns: [
            {
                ...createColumn("name", "string", "Column"),
                ...COL_PROPS(false)
            },
            {
                ...createColumn("title", "string", "Filter"),
                ...COL_PROPS(false)
            },
            {
                ...createColumn("Clear", "string", ""),
                ...COL_PROPS(false),
                width: 75,
                widthMode: ColumnWidthMode.Fixed,
                textAlign: "center",
                itemRenderer: ({ node }) => {
                    return buttonCreator(node, "delete-icon", "Delete Settings", () => {
                        api.clearFilterValue(resolveExpression(node.rowPosition?.data, "key"));
                        setPopupVisible(false);
                    }, GridIconButton.Delete);
                }, headerOptions: {
                    headerRenderer: ({ node }) => {
                        return <>                   {buttonCreator(node, "delete-icon", "Delete All Filters", () => {
                            api.clearAllFilterValues();
                            setPopupVisible(false);
                        }, GridIconButton.Delete)}
                            {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel)}</>;
                    }
                }
            }
        ]
    }), [filterChips]);
    return <>
        {filterChips.length > 0 && <PopupButton popupWidth={400} popupHeight={300} node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} useMouseXY trigger={<div className="ezgrid-dg-toolbar-section"> | 
                {buttonCreator(node, "filter-icon", "Current Filters", () => setPopupVisible(true),
                    GridIconButton.Filter)}({filterChips.length})</div>}
        />}
        {popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
            <ReactDataGrid style={{ width: "400px", height: "100%" }} gridOptions={gridOptions}></ReactDataGrid>
        </Popup>}
    </>;
};
