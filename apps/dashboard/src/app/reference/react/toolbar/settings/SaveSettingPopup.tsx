import { Box, GridIconButton, LABELS, RendererProps, TreeNodeType } from "@ezgrid/grid-core";
import { FC, useState } from "react";
import { createCheckBox, createTextField } from "../../adapter";
import { buttonCreator, Popup, PopupButton } from "../../shared";

export interface SaveSettingPopupProps extends RendererProps {
    onSaveSetting : (settingName:string) => void;
}
export const SaveSettingPopup: FC<SaveSettingPopupProps> = ({ node,onSaveSetting }) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const [isDefault, setIsDefault] = useState<boolean>(false);
    const [settingName, setSettingName] = useState<string>("");

    const backgroupProps = node.gridOptions?.nodePropsFunction?.({
        ...node,
        type: TreeNodeType.Grid
    }, { style: {}, className: "", key: "" });
    const onSave = () => {
        if (settingName) {
            onSaveSetting(settingName);
            setPopupVisible(false);
        } else {
            alert("Please enter a name for the setting");
        }
    };

    return <div >
        {<PopupButton popupWidth={400} popupHeight={125} node={node} setRectangle={setRectangle} setPopupVisible={setPopupVisible}
            popupVisible={popupVisible} useMouseXY trigger={buttonCreator(node, "save-icon", "Save Settings", () => setPopupVisible(true),
                GridIconButton.SettingsSave)}
        />}
        {popupVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setPopupVisible}>
            <div className="ezgrid-dg-save-settings" style={backgroupProps?.style}>
                <div className="ezgrid-dg-save-settings-header">
                    {buttonCreator(node, "save-icon", "Save Setting", onSave, GridIconButton.SettingsSave)}
                    {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel)}
                </div>
                <div>Name:</div>
                {createTextField(node.gridOptions, {
                    onChange: (e) => {
                        setSettingName(e);
                    },
                    placeholder: "Enter a name for the setting",
                    readOnly: isDefault,
                    value: settingName
                })}
                <div>Is Default:</div>
                <div>
                    {
                        createCheckBox(node.gridOptions, {
                            onChange: (e) => {
                                if (e) {
                                    setSettingName(node.gridOptions.settingsOptions?.defaultSettingsName || LABELS.DEFAULT_SETTINGS_NAME);
                                }
                                setIsDefault(e);
                            },
                            value: isDefault
                        })
                    }
                </div>
                <div></div>
                <div>
                </div>
            </div>
        </Popup>}
    </div>;
};
