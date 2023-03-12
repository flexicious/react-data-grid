import { Box, getApi, getRectFromDom, GridIconButton, RendererProps } from "@euxdt/grid-core";
import { FC, useState } from "react";
import { Popup, PopupButton } from "../../shared/PopupButton";
import { buttonCreator } from "../../shared/shared-props";
import { ManageSettingsGrid } from "./ManageSettingsGrid";
import { SaveSettingsPopup } from "./SaveSettingsPoup";
import { SettingsTree } from "./SettingsTree";

export const SettingsMenu: FC<RendererProps> = ({ node }) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [manageSettingsVisible, setManageSettingsVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const hasSettings = (node.gridOptions.contextInfo?.savedSettings || []).length > 0;
    const api = getApi(node);
    const setBoundingRect = () => {
        const rect = getRectFromDom(api.getGridBox(true));
        if (rect) {
            setRectangle({ ...rect, width: undefined });
        }
    };
    return <div className="euxdt-dg-toolbar-section">
        <PopupButton node={node} popupVisible={settingsVisible} setPopupVisible={setSettingsVisible}
            trigger={buttonCreator(node, "page-settings-icon", "Settings", setBoundingRect, GridIconButton.Settings)}
        />
        {settingsVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setSettingsVisible}>
            <SettingsTree node={node} setPopupVisible={setSettingsVisible} />
        </Popup>
        }
        {node.gridOptions.settingsOptions?.settingsStorageKey
            && <SaveSettingsPopup node={node} />}

        {hasSettings &&
            <PopupButton node={node} popupVisible={manageSettingsVisible} setPopupVisible={setManageSettingsVisible}
                trigger={buttonCreator(node, "manage-settings-icon", "Manage Settings", setBoundingRect, GridIconButton.SettingsManage)}
            />}
        {manageSettingsVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setManageSettingsVisible}>
            <ManageSettingsGrid node={node} setPopupState={setManageSettingsVisible} />
        </Popup>
        }
    </div>;
};
