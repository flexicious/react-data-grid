import { Box, getApi, gridCSSPrefix, PreventableEvent, stopPrevent, stopPropagation, TreeNodeType, VirtualTreeNode } from "@euxdt/grid-core";
import { ReactElement, ReactNode, RefObject, useEffect } from "react";
import { createTextField } from "../adapter";

export interface PopupButtonProps {
    boundingRect?: DOMRect;
    node: VirtualTreeNode;
    popupVisible: boolean;
    setPopupVisible: (value: boolean) => void;
    setRectangle?: (value: Box) => void;
    className?: string;
    textInputRef?: RefObject<HTMLInputElement>;
    textInputValue?: string;
    trigger?: ReactElement;
    popupWidth?: number;
    popupHeight?: number;
    useMouseXY?: boolean;
}

export const PopupButton = ({ boundingRect, node, popupVisible, setPopupVisible, setRectangle,
    className, textInputRef, trigger, popupWidth, useMouseXY, popupHeight, textInputValue }: PopupButtonProps) => {
    const onTogglePopup = (e?: PreventableEvent) => {

        if (setRectangle) {
            let { width, height, x, y } = boundingRect || { width: 0, height: 0, x: 0, y: 0 };
            if (useMouseXY && e) {
                x = (e as MouseEvent).clientX + 8;
                y = (e as MouseEvent).clientY + 8;
            }
            width = popupWidth || Math.max(width + 30, 200);
            const maxX = window.innerWidth - width;
            const maxY = window.innerHeight - height - (popupHeight || 300);
            const rect = { width: `${width}px`, height: "", top: `${y + (height)}px`, left: `${x}px` };
            if (popupHeight) {
                rect.height = `${popupHeight}px`;
            }
            if (x > maxX) {
                rect.left = `${maxX}px`;
            }
            if (y > maxY) {
                rect.top = `${y - (popupHeight || 300)}px`;
            }
            setRectangle(rect);
        }
        stopPrevent(e);
        setPopupVisible(!popupVisible);
    };
    return <>{textInputRef ? createTextField(node.gridOptions, {
        readOnly: true, type: "text", placeholder: "Select...", value: textInputValue,
        onClick: onTogglePopup, ref: textInputRef, style: { width: "100%" }
    }) : <></>}<div className={className}
        onClick={onTogglePopup}
    >{trigger}</div></>;
};
interface PopupProps extends Pick<PopupButtonProps, "setPopupVisible"> {
    rectangle: Box | undefined;
    children: ReactNode | (ReactNode | ReactNode[])[];
    node: VirtualTreeNode;
    makeBackground?: boolean;
}

export const Popup = ({ rectangle, children, node, setPopupVisible, makeBackground }: PopupProps) => {
    const api = getApi(node);
    useEffect(() => {
        api.suspendMouseEvents();
        return () => {
            api.resumeMouseEvents();
        };
    }, []);



    const styles = node.gridOptions?.nodePropsFunction?.({ ...node, type: TreeNodeType.Grid }, { style: {}, className: "", key: "" })?.style;
    const child = <div className={gridCSSPrefix("popup")} style={{ ...styles, position: "fixed", ...(rectangle || {}), padding: "0px" }} onClick={stopPropagation}>
        {children}
    </div>;
    if (makeBackground === false) {
        return child;
    }

    return <div className={gridCSSPrefix("popup-background")} style={{ top: 0, left: 0, right: 0, bottom: 0 }} onClick={(e) => {
        if (e.target === e.currentTarget) {
            setPopupVisible(false);
            stopPropagation(e);
        }
    }}>
        {child}
    </div>;
};