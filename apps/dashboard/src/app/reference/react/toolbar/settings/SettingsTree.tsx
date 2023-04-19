import { ApiContext, applyColumnSettings, ColumnSettings, createColumn, getColumnSettings, getSettingsFlat, gridCSSPrefix, GridIconButton, RendererProps } from "@euxdt/grid-core";
import { FC, useEffect, useRef, useState } from "react";
import { ReactDataGrid } from "../../ReactDataGrid";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../../shared/shared-props";
import { Expander } from "../Expander";

interface SettingsRendererProps extends RendererProps {
    setPopupVisible: (visible: boolean) => void;
}
export const SettingsTree: FC<SettingsRendererProps> = ({ node, setPopupVisible }) => {
    const apiRef = useRef<ApiContext | null>(null);
    const [dataProvider, setDataProvider] = useState<ColumnSettings[]>([]);
    const [hasHierarchy, setHasHierarchy] = useState<boolean>(false);
    const gridOptions = node.gridOptions;
    useEffect(() => {
        const settings = getColumnSettings(node.gridOptions);
        const flatSettings = getSettingsFlat(settings);
        if (flatSettings.length !== settings.length)
            setHasHierarchy(true);
        const visibleCols = flatSettings.filter((s) => !s.hidden).map((s) => s.uniqueIdentifier);
        setDataProvider(settings);
        setTimeout(() => {
            apiRef.current?.api?.expandAll();
            apiRef.current?.api?.setSelectedRows(visibleCols);
            apiRef.current?.api?.rebuild();
        }, 100);

    }, []);
    const applySettingsToGrid = () => {
        setPopupVisible(false);
        const selectedRows = apiRef.current?.api?.getSelectedRows();
        const flatSettings = getSettingsFlat(dataProvider);
        flatSettings.forEach((s) => { s.hidden = !selectedRows?.includes(s.uniqueIdentifier); });
        applyColumnSettings(node.gridOptions, dataProvider);
    };
    const onReset = () => {
        gridOptions.contextInfo?.gridApi?.resetView();
        setPopupVisible(false);
    };
    return <>
        <ReactDataGrid style={{ width: "350px", height: "100%" }} gridOptions={{
            dataProvider,
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiRef.current = ctx;
                    apiRef.current?.api?.expandAll();
                }
            },
            ...GRID_PROPS(node, "uniqueIdentifier"),
            enableDynamicLevels: true,
            nextLevel: {
                childrenField: "children",
            },
            selectionOptions: {
                enableSelectionCascade: true,
                enableSelectionBubble: true,
                enableSelectionHighlight: false
            },
            columns: [
                {
                    ...createColumn("name", "string", "Show All"),
                    ...COL_PROPS(true),
                    enableHierarchy: hasHierarchy,
                    enableDrag: true,
                    headerOptions: {
                        headerRenderer: ({ node }) => {
                            const context = node.gridOptions?.contextInfo;
                            return <div className={gridCSSPrefix("toolbar-spacer")}>
                                <div className={gridCSSPrefix("toolbar-section")} >
                                    Show All {(context?.expansion?.maxExpandLevel || 0) > 1 && <Expander node={node} />}
                                </div>
                                <div className={gridCSSPrefix("toolbar-section")} >
                                    {buttonCreator(node, "reset-icon", "Reset View to Default", onReset, GridIconButton.Reset)}
                                    {buttonCreator(node, "check-icon", "Apply Settings", applySettingsToGrid, GridIconButton.Apply)}
                                    {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel)}
                                </div>
                            </div>;
                        }
                    },
                },
            ]
        }}></ReactDataGrid>
    </>;
};
