import { Box, calculateFooterValue, ColumnMenuItem, FooterOperation, formatValue, getApi, RendererProps, resolveExpression } from "@euxdt/grid-core";
import { FC, useRef, useState } from "react";
import { createMenu } from "../adapter";
import { Popup, PopupButton } from "../shared/PopupButton";

const FooterMenu : FC<RendererProps> = ({ node }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const api = getApi(node);
    const ctx = api.getContext();
    const getCol = () => node.columnPosition?.column;
    const getItems = () => {
        if(!ctx)return;
        const dp =(ctx.expansion?.maxExpandLevel||0) > 0 ?ctx.rowPositions.map(pos=>pos.data):ctx.filteredDataProvider;
        const col = getCol();
        if(!col)return;
        const numbers = dp.map(d=>resolveExpression(d,col.dataField));
        const calculate = (op: FooterOperation) => {
            return calculateFooterValue({...col, footerOptions:{footerOperation: op}}, numbers);
        };
        const formatCalculate = (op: FooterOperation) => formatValue(calculate(op), col);
        const setFooterOverRide = (op: FooterOperation) => {
            setPopupVisible(false);
            api.setFooterOverride(col.uniqueIdentifier, op);
            if(api.getGroupByFields().length > 0){
                api.groupBy(ctx!.modifications!.groupFields!);
            }
        };
        const min = calculate(FooterOperation.Min);
        const max = calculate(FooterOperation.Max);
        const menuItems = [
            { label: "Avg: " + formatCalculate(FooterOperation.Avg), className: "", onClick: () => setFooterOverRide(FooterOperation.Avg) },
            { label: "Median: " + formatCalculate(FooterOperation.Median), className: "", onClick: () => setFooterOverRide(FooterOperation.Median) },
            { label: "Count: " + formatCalculate(FooterOperation.Count), className: "", onClick: () => setFooterOverRide(FooterOperation.Count) },
            { label: "Min: " + formatValue(min, col), className: "", onClick: () => setFooterOverRide(FooterOperation.Min) },
            { label: "Max: " + formatValue(max, col), className: "", onClick: () => setFooterOverRide(FooterOperation.Max) },
            { label: "Sum: " + formatCalculate(FooterOperation.Sum), className: "", onClick: () => setFooterOverRide(FooterOperation.Sum) },
        ];
        const customItems = node.gridOptions.columnMenuOptions?.footerMenuItems?.(node, menuItems as (ColumnMenuItem | null)[]) || menuItems;
        return customItems;
    };
    return <><div ref={divRef} >
        <PopupButton node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} popupWidth={200} useMouseXY popupHeight={225}
            className="euxdt-dg-footer-menu"
            boundingRect={divRef.current?.getBoundingClientRect()} />
            </div>
                {
                    popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
                        <div className="euxdt-dg-header-hamburger-menu">
                        {
                            createMenu(node.gridOptions, {
                                ...node,
                                options: getItems() || [], 
                            })
                        }
                    </div>
                </Popup>
        }
    </>;
};
export const FooterMenuRenderer = (props: RendererProps) => <FooterMenu key={props.node.key} {...props} />;