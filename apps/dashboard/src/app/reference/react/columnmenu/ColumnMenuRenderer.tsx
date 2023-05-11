import { Behaviors, Box, ColumnMenuItem, getApi, getLockMode, HorizontalScrollMode, LABELS, LockMode, RendererProps } from "@ezgrid/grid-core";
import { FC, MouseEvent, useRef, useState } from "react";
import { createMenu } from "../adapter";
import { Popup, PopupButton } from "../shared/PopupButton";

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
        { label: LABELS.COPY_COLUMN, className: "clear-filter-icon", onClick: () => (getCol()) && api.copyColumn({rowIdentifier:"header",columnIdentifier:getCol()?.uniqueIdentifier!}) },
        { label: LABELS.SELECT_COLUMN, className: "clear-filter-icon", onClick: () => (getCol()) && api.selectColumn({rowIdentifier:"header",columnIdentifier:getCol()?.uniqueIdentifier!}) },
        null,

        { label: LABELS.FIT_TO_CONTENT, className: "fit-width-icon", onClick: () => (getCol()) && api.autoFitColumns([getCol()!]) },
        { label: LABELS.FIT_TO_CONTENT_INCLUDE_HEADER, className: "fit-all-width-icon", onClick: () => (getCol()) && api.autoFitColumns([getCol()!], true) },
        { label: LABELS.FILL_ALL_COLUMNS, className: "fit-width-icon", onClick: () => api.autoFitColumns() },
        { label: LABELS.FILL_ALL_COLUMNS_INCLUDE_HEADER, className: "fit-all-width-icon", onClick: () => api.autoFitColumns(undefined, true) },

    ].flat().filter(x => typeof x === "object");
    const customItems = node.gridOptions.columnMenuOptions?.columnMenuItems?.(node, menuItems as (ColumnMenuItem | null)[]) || menuItems;
    const hidePopup = ()=>{
        setPopupVisible(false);
    }
    return <><div ref={divRef}>
        <PopupButton node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} popupWidth={300} useMouseXY
            className="ezgrid-dg-header-hamburger"
            boundingRect={divRef.current?.getBoundingClientRect()} />
            </div>
                {
                    popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                        <div className="ezgrid-dg-header-hamburger-menu"  onClick={hidePopup}>
                        {
                            createMenu(node.gridOptions, {
                                ...node,
                                options: customItems || [], 
                            })
                        }
                    </div>
                </Popup>
        }
    </>;
};
export const ColumnOptionsMenuRenderer = (props: RendererProps) => <ColumnOptionsMenu key={props.node.key} {...props} />;