import { ChartSetting, createColumn, gridCSSPrefix, GridIconButton, GridOptions, GridSelectionMode, nullifyParent, pasteToClipboard, RendererProps, resolveExpression, SettingsData } from "@ezgrid/grid-core";
import { FC, useEffect, useMemo, useState } from "react";

import { ReactDataGrid } from "../../ReactDataGrid";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../../shared/shared-props";

interface ManageSettingsRendererProps extends RendererProps {
    setPopupState: (visible: boolean) => void;
    getSettings: () => (SettingsData|ChartSetting)[];
    applySetting: (settings: SettingsData|ChartSetting) => void;
    deleteSetting: (settings: SettingsData|ChartSetting) => void;
}
export const ManageSettingsGrid: FC<ManageSettingsRendererProps> = ({ node, setPopupState, getSettings,applySetting,deleteSetting }) => {
    const [dataProvider, setDataProvider] = useState<(SettingsData|ChartSetting)[]>([]);
    useEffect(() => {
        setDataProvider(getSettings());
    }, [node.gridOptions]);

    const gridOptions = node.gridOptions;
    const onApplySettings = (settings?: SettingsData|ChartSetting) => {
        if (settings)
            applySetting?.(settings);
    };
    const onDeleteSettings = (settings?: SettingsData|ChartSetting) => {
        if (settings && confirm(`Are you sure you want to delete the setting ${settings?.name}?`)) {
            deleteSetting?.(settings);
            setPopupState(false);
        }
    };
    const onReset = () => {
        gridOptions.contextInfo?.gridApi?.resetView();
        setPopupState(false);
    };
    const sectionPrefix = gridCSSPrefix("toolbar-section");
    const dgOptions = useMemo<GridOptions>(() => ({
        dataProvider,
        enableContextMenu: true,
        contextMenuOptions: {
            contextMenuItems: (node, currentItems) => {
                return [
                    {
                        label: "View Source",
                        className: "check-icon",
                        onClick: () => {
                            const setting = (node.gridOptions?.contextInfo?.contextMenuInfo?.cell);
                            if (!setting) return;
                            const settings = dataProvider.find(d => d.name === setting.rowIdentifier) as SettingsData;
                            if (settings && settings.columnSettings) {
                                nullifyParent(settings.columnSettings);
                            }
                            pasteToClipboard(JSON.stringify(settings || "{}"));
                            alert("Settings copied to clipboard");
                        },
                    },
                ];
            },
        },
        ...GRID_PROPS(node, "name"),
        selectionMode: GridSelectionMode.SingleRow,
        columns: [
            {
                ...createColumn("name", "string", "Manage Settings"),
                ...COL_PROPS(false),
                headerOptions: {
                    headerRenderer: ({ node }) => {
                        return <div className={gridCSSPrefix("toolbar-spacer")} >
                            <div className={sectionPrefix} >
                                Settings
                            </div>
                            <div className={sectionPrefix} >
                                {buttonCreator(node, "reset-icon", "Reset View to Default", onReset, GridIconButton.Reset)}
                                {buttonCreator(node, "close-icon", "Close Popup", () => setPopupState(false), GridIconButton.Cancel)}
                            </div>
                        </div>;
                    }
                },
                itemRenderer: ({ node }) => {
                    return <div className={gridCSSPrefix("toolbar-spacer")} >
                        {resolveExpression(node.rowPosition?.data, "name")}
                        <div>
                            {buttonCreator(node, "check-icon", "Apply Settings", () => onApplySettings(node.rowPosition?.data as SettingsData), GridIconButton.Apply)}
                            {buttonCreator(node, "delete-icon", "Delete Settings", () => onDeleteSettings(node.rowPosition?.data as SettingsData), GridIconButton.Delete)}
                        </div>
                    </div>;
                },
            },
        ]
    }), [dataProvider]);
    return <>
        <ReactDataGrid style={{ width: "300px", height: "100%" }} gridOptions={dgOptions}></ReactDataGrid>
    </>;
};
