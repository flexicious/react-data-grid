import { ColumnPositionInfo, GridContext, HorizontalScrollMode, stopPrevent } from "@ezgrid/grid-core";
import { FC, MouseEvent, useRef, DetailedHTMLProps, HTMLAttributes } from "react";

export interface ResizableDivProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    gridContext: GridContext,
    columnPosition?: ColumnPositionInfo
}
export const HeaderCell: FC<ResizableDivProps> = (props) => {
    const divRef = useRef<HTMLDivElement>(null);
    const { children, gridContext, columnPosition, ...rest } = props;
    let resizer: HTMLDivElement | null = null;
    let rect: DOMRect | null = null;
    let maxX = 0;
    let oldCursor = "";
    let operation: "" | "resize" | "drag" = "";
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (divRef.current && e.button === 0) {
            const className = (((e.target as HTMLElement)?.className) || "").toString();

            if (className.endsWith("resize")) {
                showResizer(e);
                document.body.style.cursor = "col-resize";
                gridContext.gridApi.suspendMouseEvents();
                operation = "resize";
                if(columnPosition?.column)
                gridContext.gridOptions.eventBus?.onColumnResizeBegin?.(columnPosition.column);

            } else if (className.endsWith("drag")) {
                showResizer(e);
                positionResizer(rect!);
                document.body.style.cursor = "move";
                operation = "drag";
                if(columnPosition?.column)
                gridContext.gridOptions.eventBus?.onColumnDragBegin?.(columnPosition.column);
            }
        }
    };
    const showResizer = (e: MouseEvent<HTMLDivElement>) => {
        if (divRef.current) {
            const { current } = divRef;
            rect = current.getBoundingClientRect();
            resizer = document.createElement("div");
            document.body.appendChild(resizer);
            resizer.style.height = `${gridContext.gridSize.height}px`;
            resizer.style.top = `${rect.top - gridContext.toolbarHeight}px`;
            resizer.style.left = `${rect.left + rect.width}px`;
            if (gridContext.gridOptions.horizontalScroll === HorizontalScrollMode.Off) {
                maxX = rect.left + gridContext.gridSize.width - (columnPosition?.startPosition || 0) - 30;
            } else {
                maxX = window.innerWidth - 30;
            }
            resizer.className = "ezgrid-dg-resize-bar";
            oldCursor = document.body.style.cursor;
            document.addEventListener("mouseup", mouseUpHandler as any);
            document.addEventListener("mousemove", mouseMoveHandler as any);
            stopPrevent(e);
        }
    };
    const getCls = ({className}:{className:string}) => {
        if (className && typeof className === "string") {
            return className;
        }
        return "";
    };
    const positionResizer= (cellRect:DOMRect)=>{
        if(!resizer) return;
        resizer.style.left = `${cellRect.left + cellRect.width}px`;
        resizer.style.width = `${cellRect.width}px`;
        resizer.style.height = `${cellRect.height}px`;
        resizer.style.top = `${cellRect.top}px`;
        resizer.style.background= "none";
        resizer.style.borderLeft = "2px solid #000";
        resizer.style.display = "block";
    };

    const handleMouseMove = (e: MouseEvent) => {
        const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
        const dropZone = elementsUnderMouse.find((elem) => getCls(elem).includes("ezgrid-dg-group-drop-zone")) as HTMLElement;

        if (dropZone) {
            if (resizer) {
                resizer.style.display = "none";
            }
        } else if (operation === "resize") {
            if (resizer) {
                resizer.style.display = "block";
            }
        }
        if (operation === "drag") {
            const tryDrop = gridContext.gridApi.shiftColumn(columnPosition?.column.uniqueIdentifier,
                gridContext.modifications.activeCell, true);
            if (tryDrop) {
                if (resizer && rect) {
                    const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
                    const cell = elementsUnderMouse.find((elem) => elem.hasAttribute("data-row-identifier") && elem.hasAttribute("data-column-identifier") && (getCls(elem)).includes("ezgrid-dg-cell"));
                    if (cell) {

                        const cellRect = cell.getBoundingClientRect();
                        positionResizer(cellRect);

                    } else {
                        resizer.style.display = "none";
                    }
                }
            } else {
                if (resizer && rect) 
                resizer.style.display = "none";
            }
        }
        else {
            if (resizer && rect) {
                resizer.style.display = "block";
                resizer.style.left = `${Math.min(Math.max(rect.left + 30, e.clientX), maxX)}px`;
            }
        }
    };
    const mouseMoveHandler = (e: MouseEvent) => { handleMouseMove(e); };
    const handleMouseUp = (e: MouseEvent) => {
        const colId = columnPosition?.column.uniqueIdentifier;
        if (resizer && colId) {
            if (operation === "resize") {
                if (rect) {
                    const delta = Math.max(0, (resizer.getBoundingClientRect().left || 0) - (rect.left || 0));
                    if (colId){
                        gridContext.gridApi.setColumnWidth(colId, delta);
                        if(columnPosition?.column)
                        gridContext.gridOptions.eventBus?.onColumnResizeEnd?.(columnPosition.column);
                    }
                }
            } else {
                const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
                const dropCell = elementsUnderMouse.find((elem) => getCls(elem).includes("ezgrid-dg-drop-right-cell"));
                const dropZone = elementsUnderMouse.find((elem) => getCls(elem).includes("ezgrid-dg-group-drop-zone"));
                if (dropZone) {
                    if(dropCell){
                        const dropIndex = parseInt(dropCell.getAttribute("data-drop-index") || "0");
                        const groupBys = gridContext.modifications.groupFields;
                        if(groupBys&& dropIndex >= 0){
                            groupBys.splice(dropIndex+1, 0, colId);
                            gridContext.gridApi.groupBy(groupBys);
                        }
                        else {
                            gridContext.gridApi.addGroupBy(colId);
                        }
                    } else {
                        gridContext.gridApi.addGroupBy(colId);
                    }
                }
                else {
                    gridContext.gridApi.shiftColumn(colId, gridContext.modifications.activeCell, false);
                }
            }
            resizer.remove();
            resizer = null;
        }
        document.removeEventListener("mouseup", mouseUpHandler as any);
        document.removeEventListener("mousemove", mouseMoveHandler as any);
        if(columnPosition?.column)
            gridContext.gridOptions.eventBus?.onColumnDragEnd?.(columnPosition.column);
        if (document.body.style.cursor !== oldCursor)
            document.body.style.cursor = oldCursor;
        gridContext.gridApi.resumeMouseEvents();
    };
    const mouseUpHandler = (e: MouseEvent) => { handleMouseUp(e); };

    return <div ref={divRef} {...rest} onMouseDown={handleMouseDown} >{children}</div>;
};
