import { Behaviors, Box, ColumnMenuItem, ColumnWidthMode, createColumn, getLockMode, HorizontalScrollMode, LABELS, LockMode, RendererProps } from "@euxdt/grid-core";
import { ReactDataGrid, PopupButton, Popup } from "@euxdt/grid-react";
import SampleData from "../mockdata/SampleData";

import { getApi, gridCSSPrefix } from "@euxdt/grid-core";
import { MouseEvent, useRef, useState, FC, ReactNode } from "react";

export const ColumnMenu = () => {
    return <div className="euxdt-dg-toolbar-section" style={{ width: "100%", gap: 10 }}>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Column Menu Enabled</b>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: SampleData.bookData,
                horizontalScroll: HorizontalScrollMode.Off,
                enableToolbar: false,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                columns: [
                    { ...createColumn("id", "number"), width: 50, widthMode: ColumnWidthMode.Fixed },
                    { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
                ]
            }}></ReactDataGrid>
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Column Menu With CustomItems</b>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: SampleData.bookData,
                horizontalScroll: HorizontalScrollMode.Off,
                enableToolbar: false,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                columnMenuOptions: {
                    columnMenuItems: (node, currentItems) => {
                        return [...currentItems, null, {
                            label: "Custom Menu Item",
                            className: "run-filter-icon",
                            onClick: () => {
                                alert("Custom Menu Item Clicked");
                            }
                        }];
                    }
                },

                columns: [
                    { ...createColumn("id", "number"), width: 50, widthMode: ColumnWidthMode.Fixed },
                    { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
                ]
            }}></ReactDataGrid>
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
            <b>Column Menu With Custom Renderer</b>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: SampleData.bookData,
                horizontalScroll: HorizontalScrollMode.Off,
                enableToolbar: false,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                columnMenuOptions: {
                    columnMenuItems: (node, currentItems) => {
                        return [...currentItems, null, {
                            label: "Custom Menu Item",
                            className: "run-filter-icon",
                            onClick: () => {
                                alert("Custom Menu Item Clicked");
                            }
                        }];
                    },
                    columnMenuRenderer: (props: RendererProps) => <ColumnOptionsMenu {...props} />
                },
                columns: [
                    { ...createColumn("id", "number"), width: 50, widthMode: ColumnWidthMode.Fixed },
                    { ...createColumn("description", "string"), variableRowHeightOptions: { enabled: true, heightAdjustment: 10 } },
                ]
            }}></ReactDataGrid>
        </div>


    </div>;
};



const ColumnOptionsMenu: FC<RendererProps> = ({ node }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const api = getApi(node);
    const opts = node.gridOptions;
    const getCol = () => node.columnPosition?.column;
    const lockMode = getLockMode(node.gridOptions.contextInfo!, getCol()!);
    const getColId = () => getCol()?.uniqueIdentifier || "";
    const setLockMode = (lockMode: LockMode) => (getColId()) && api.setLockMode(getColId(), lockMode);
    const sortColumn = (e: MouseEvent<HTMLAnchorElement>, isAscending: boolean) => {
        if (getColId()) {
            api.setSort({
                sortColumn: getColId(), isAscending: isAscending
            });
        }
    };
    const menuItems = [
        opts.horizontalScroll !== HorizontalScrollMode.Off ? [
            lockMode !== LockMode.Left ? { label: LABELS.LOCK_LEFT, className: "lock-left-icon", onClick: () => setLockMode(LockMode.Left) } : undefined,
            lockMode !== LockMode.Right ? { label: LABELS.LOCK_RIGHT, className: "lock-right-icon", onClick: () => setLockMode(LockMode.Right) } : undefined,
            lockMode !== LockMode.None && lockMode ? { label: LABELS.REMOVE_LOCK, className: "unlock-icon", onClick: () => setLockMode(LockMode.None) } : undefined,
            { label: LABELS.UNLOCK_ALL, className: "unlock-icon", onClick: api.unlockAllColumns },
            { label: LABELS.HIDE_COL, className: "hide-col-icon", onClick: () => api.showHideColumn(getColId(), false) }, null] : undefined,

        getCol()?.enableSort !== false ? [
            { label: LABELS.SORT_ASCENDING, className: "sort-ascending-icon", onClick: (e: MouseEvent<HTMLAnchorElement>) => sortColumn(e, true) },
            { label: LABELS.SORT_DESCENDING, className: "sort-descending-icon", onClick: (e: MouseEvent<HTMLAnchorElement>) => sortColumn(e, false) },
            getColId() && api.getSort(getColId()) ? { label: LABELS.REMOVE_SORT, className: "sort-none-icon", onClick: () => getColId() && api.clearSort(getColId()) } : undefined,
            { label: LABELS.REMOVE_ALL_SORTS, className: "sort-none-icon", onClick: api.clearAllSorts }
            , null] : undefined,
        opts.enableFilters !== false && api.hasBehavior(Behaviors.FilterBehavior) ? [
            { label: LABELS.RUN_FILTER, className: "run-filter-icon", onClick: api.rebuild },
            getColId() && api.getFilterValue(getColId()) !== undefined ? { label: LABELS.CLEAR_FILTER, className: "clear-filter-icon", onClick: () => getColId() && api.clearFilterValue(getColId()) } : undefined,
            { label: LABELS.CLEAR_ALL_FILTERS, className: "clear-filter-icon", onClick: api.clearAllFilterValues }
            , null] : undefined,

        { label: LABELS.FIT_TO_CONTENT, className: "fit-width-icon", onClick: () => (getCol()) && api.autoFitColumns([getCol()!]) },
        { label: LABELS.FIT_TO_CONTENT_INCLUDE_HEADER, className: "fit-all-width-icon", onClick: () => api.autoFitColumns() },
        { label: LABELS.FILL_ALL_COLUMNS, className: "fit-width-icon", onClick: () => (getCol()) && api.autoFitColumns([getCol()!], true) },
        { label: LABELS.FILL_ALL_COLUMNS_INCLUDE_HEADER, className: "fit-all-width-icon", onClick: () => api.autoFitColumns(undefined, true) }
    ].flat().filter(x => typeof x === "object");
    const customItems = node.gridOptions.columnMenuOptions?.columnMenuItems?.(node, menuItems as (ColumnMenuItem | null)[]) || menuItems;

    return <><div ref={divRef} >
        <PopupButton node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} popupWidth={300} useMouseXY
            className="euxdt-dg-header-hamburger"
            boundingRect={divRef.current?.getBoundingClientRect()} />
    </div>
        {
            popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                <div className="euxdt-dg-header-hamburger-menu">
                    {customItems.map((x, i) => {
                        const menuItem = x as ColumnMenuItem;
                        return x ? <div key={i}><div className={gridCSSPrefix(menuItem.className)}
                            onClick={(menuItem.onClick)}>{menuItem.label as ReactNode}</div></div> :
                            <div key={i} style={{ borderBottom: "solid 2px red" }} />;
                    })
                    }
                </div>
            </Popup>
        }
    </>;
};
