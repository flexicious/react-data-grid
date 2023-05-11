import { applySettings, Box, getApi, getColumnSettings, getRectFromDom, GridIconButton, loadSettings, RendererProps, saveSetting, SettingsData } from "@ezgrid/grid-core";
import { FC, useState } from "react";
import { Popup, PopupButton } from "../../shared/PopupButton";
import { buttonCreator } from "../../shared/shared-props";
import { ManageSettingsGrid } from "./ManageSettingsGrid";
import { SaveSettingPopup } from "./SaveSettingPopup";
import { SettingsTree } from "./SettingsTree";

export const SettingsMenu: FC<RendererProps> = ({ node }) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [manageSettingsVisible, setManageSettingsVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const hasSettings = (node.gridOptions.contextInfo?.savedSettings?.settingsData || []).length > 0;
    const api = getApi(node);
    const setBoundingRect = () => {
        const rect = getRectFromDom(api.getGridBox(true));
        if (rect) {
            setRectangle({ ...rect, width: undefined });
        }
    };
    const onSaveSetting = (settingName:string) => {
        if (settingName) {
            const ctx = api.getContext()?.modifications;
            api.saveSetting({
                columnSettings: getColumnSettings(node.gridOptions),
                name: settingName,
                globalFilter: ctx?.globalFilterValue,
                globalFilterTree: ctx?.globalFilterTree,
            });
            api.rebuild();
        } else {
            alert("Please enter a name for the setting");
        }
    };
    return <div className="ezgrid-dg-toolbar-section">
        <PopupButton node={node} popupVisible={settingsVisible} setPopupVisible={setSettingsVisible}
            trigger={buttonCreator(node, "page-settings-icon", "Settings", setBoundingRect, GridIconButton.Settings)}
        />
        {settingsVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setSettingsVisible}>
            <SettingsTree node={node} setPopupVisible={setSettingsVisible} />
        </Popup>
        }
        {node.gridOptions.settingsOptions?.settingsStorageKey
            && <SaveSettingPopup node={node} onSaveSetting={onSaveSetting}/>}

        {hasSettings &&
            <PopupButton node={node} popupVisible={manageSettingsVisible} setPopupVisible={setManageSettingsVisible}
                trigger={buttonCreator(node, "manage-settings-icon", "Manage Settings", setBoundingRect, GridIconButton.SettingsManage)}
            />}
        {manageSettingsVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setManageSettingsVisible}>
            <ManageSettingsGrid node={node} setPopupState={setManageSettingsVisible} getSettings={()=>loadSettings(node.gridOptions)?.settingsData || []}
                applySetting={(settings) => applySettings(node.gridOptions,settings as SettingsData)} 
                deleteSetting={ (settings) => saveSetting(node.gridOptions, settings as SettingsData, true)}
            />
        </Popup>
        }
    </div>;
};
