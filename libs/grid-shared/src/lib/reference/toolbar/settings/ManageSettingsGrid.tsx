import { applySettings, createColumn, gridCSSPrefix, GridIconButton, loadSettings, nullifyParent, pasteToClipboard, RendererProps, resolveExpression, saveSettings, SettingsData } from "@ezgrid/grid-core";
import { FC, useEffect, useState } from "react";

import { ReactDataGrid } from "../../ReactDataGrid";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../../shared/shared-props";
interface ManageSettingsRendererProps extends RendererProps {
    setPopupState: (visible: boolean) => void;
}
export const ManageSettingsGrid: FC<ManageSettingsRendererProps> = ({ node, setPopupState }) => {
    const [dataProvider, setDataProvider] = useState<SettingsData[]>([]);
    useEffect(() => {
        const settings = loadSettings(node.gridOptions);
        setDataProvider(settings);
    }, [node.gridOptions]);

    const gridOptions = node.gridOptions;
    const onApplySettings = (settings?: SettingsData) => {
        if (settings)
            applySettings(gridOptions, settings);
        setPopupState(false);
    };
    const onDeleteSettings = (settings?: SettingsData) => {
        // eslint-disable-next-line no-restricted-globals
        if (settings && confirm(`Are you sure you want to delete the settings ${settings?.name}?`)) {
            saveSettings(gridOptions, settings, true);
            setPopupState(false);
        }
    };
    const onReset = () => {
        gridOptions.contextInfo?.gridApi?.resetView();
        setPopupState(false);
    };
    const sectionPrefix = gridCSSPrefix("toolbar-section");
    return <>
        <ReactDataGrid style={{ width: "300px", height: "100%" }} gridOptions={{
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
                                const settings = dataProvider.find(d => d.name === setting.rowIdentifier);
                                if (settings) {
                                    nullifyParent(settings.columnSettings);
                                    pasteToClipboard(JSON.stringify(settings || "{}"));
                                    alert("Settings copied to clipboard");
                                }
                            },
                        },
                    ];
                },
            },
            ...GRID_PROPS(node, "name"),
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
        }}></ReactDataGrid>
    </>;
};
