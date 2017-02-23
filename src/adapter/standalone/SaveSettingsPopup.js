/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
import UIUtils from '../../utils/UIUtils'
import Constants from '../../utils/Constants'
import UIComponent from '../../core/UIComponent'
import TriStateCheckBox from '../../controls/TriStateCheckBox'
import ToolbarAction from '../../flexgrid/valueobjects/ToolbarAction'
import React from 'react'
/**
 * A SaveSettingsPopup that which can be used within the filtering/binding infrastructure.
 * @constructor
 * @class SaveSettingsPopup
 * @namespace flexiciousNmsp
 * 
 */
export default class SaveSettingsPopup extends UIComponent {
    constructor() {
        super({}, "div")
        this.attachClass("flexiciousGrid");
        this.setWidth(600);
        this.setHeight(145);
    }

    /**
     *
     * @return {Array}
     */
    getClassNames() {
        return ["SaveSettingsPopup", "UIComponent"];
    }
    showDialog() {
        const actions = [ToolbarAction.create(this.grid.enableMultiplePreferences ? Constants.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES : Constants.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES
            , this.onClearSettings.bind(this), true),
        ToolbarAction.create(Constants.SAVE_SETTINGS_SAVE_PREFERENCES, this.onSaveSettings.bind(this), true),
        ToolbarAction.create(Constants.SAVE_SETTINGS_CANCEL, this.onCancel.bind(this), true)
        ];
        this.popup = UIUtils.addPopUp(this.render(), this.grid, false, null, Constants.SAVE_SETTINGS_TITLE, actions);
        this.grid.addChild(this.popup);
    }
    setGrid(val) {
        this.grid = val;
        this.preferencesSet = this.grid.preferencesSet;
        this.filtersEnabled = this.grid.getEnableFilters();
        this.preferenceName = this.grid.getCurrentPreferenceInfo() ? grid.getCurrentPreferenceInfo().name : 'Default';
        this.preferenceIsDefault = this.grid.getCurrentPreferenceInfo() ? (grid.getCurrentPreferenceInfo().name == grid.getGridPreferencesInfo().defaultPreferenceName) : 'Default';

    }

    onClearSettings(evt) {
        this.grid.clearPreferences();
        UIUtils.showMessage("Preferences Cleared!");
        this.grid.removeChild(this.popup);
    }

    onCancel(evt) {
        this.grid.removeChild(this.popup);
    }

    onSaveSettings(domElementdiv) {

        const preferencesToPersist = [];
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_COLUMN_ORDER').checked)
            preferencesToPersist.push(Constants.PERSIST_COLUMN_ORDER);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_COLUMN_VISIBILITY').checked)
            preferencesToPersist.push(Constants.PERSIST_COLUMN_VISIBILITY);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_COLUMN_WIDTH').checked)
            preferencesToPersist.push(Constants.PERSIST_COLUMN_WIDTH);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_FILTER').checked)
            preferencesToPersist.push(Constants.PERSIST_FILTER);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_SORT').checked)
            preferencesToPersist.push(Constants.PERSIST_SORT);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_FOOTER_FILTER_VISIBILITY').checked)
            preferencesToPersist.push(Constants.PERSIST_FOOTER_FILTER_VISIBILITY);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_PAGE_SIZE').checked)
            preferencesToPersist.push(Constants.PERSIST_PAGE_SIZE);
        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_PRINT_SETTINGS').checked)
            preferencesToPersist.push(Constants.PERSIST_PRINT_SETTINGS);

        if (UIUtils.findElementWithClassName(domElementdiv, 'cbPERSIST_SCROLL').checked) {
            preferencesToPersist.push(Constants.PERSIST_VERTICAL_SCROLL);
            preferencesToPersist.push(Constants.PERSIST_HORIZONTAL_SCROLL);
        }
        this.grid.preferencesToPersist = preferencesToPersist.join(",");
        if (this.grid.enableMultiplePreferences)
            this.grid.persistPreferences(UIUtils.findElementWithClassName(domElementdiv, 'txtPreferenceName').value,
                UIUtils.findElementWithClassName(domElementdiv, 'cbDefaultPreference').checked);
        else
            this.grid.persistPreferences();
        if (this.grid.preferencePersistenceMode != "server")
            UIUtils.showMessage("Preferences Saved!");
        this.grid.removeChild(this.popup);

    }

    /**
     * Initializes the auto complete and watermark plugins
     */
    render() {
        let prefName = null;
        if (this.grid.enableMultiplePreferences) {
            <div>
                <div style={{ float: 'left' }}><span> {Constants.SAVE_SETTINGS_PREFERENCE_NAME}
                </span>
                    <input className={"txtPreferenceName"} value={this.preferenceName} />
                    <input className={"cbDefaultPreference"} type={"checkbox"} defaultChecked={this.preferenceIsDefault}> Is Default?</input>
                </div>
                <div style={{ clear: "both" }} />
            </div>;

        }
        return <div>
            {prefName}
            <table style={{ width: "550px" }}>
                <tbody>
                    <tr>
                        <td>
                            <div style={{ display: "inline-block" }}>
                                <input type={"checkbox"} className={"cbPERSIST_COLUMN_ORDER"} defaultChecked={true} />{Constants.SAVE_SETTINGS_ORDER_OF_COLUMNS}<br />
                                <input type={"checkbox"} className={"cbPERSIST_COLUMN_VISIBILITY"} defaultChecked={true} />{Constants.SAVE_SETTINGS_VISIBILITY_OF_COLUMNS}<br />
                                <input type={"checkbox"} className={"cbPERSIST_COLUMN_WIDTH"} defaultChecked={true} />{Constants.SAVE_SETTINGS_WIDTHS_OF_COLUMNS}</div>
                        </td>
                        <td>
                            <div style={{ display: "inline-block" }}>
                                <input type={"checkbox"} className={"cbPERSIST_FILTER"} defaultChecked={true} />{Constants.SAVE_SETTINGS_FILTER_CRITERIA}<br />
                                <input type={"checkbox"} className={"cbPERSIST_SORT"} defaultChecked={true} /> {Constants.SAVE_SETTINGS_SORT_SETTINGS}<br />
                                <input type={"checkbox"} className={"cbPERSIST_SCROLL"} defaultChecked={true} />{Constants.SAVE_SETTINGS_SCROLL_POSITIONS} </div>
                        </td>
                        <td>
                            <div style={{ display: "inline-block" }}>
                                <input type={"checkbox"} className={"cbPERSIST_FOOTER_FILTER_VISIBILITY"} defaultChecked={true} />{Constants.SAVE_SETTINGS_FILTER_AND_FOOTER_VISIBILITY} <br />
                                <input type={"checkbox"} className={"cbPERSIST_PAGE_SIZE"} defaultChecked={true} />{Constants.SAVE_SETTINGS_RECORDS_PER_PAGE}<br />
                                <input type={"checkbox"} className={"cbPERSIST_PRINT_SETTINGS"} defaultChecked={true} />{Constants.SAVE_SETTINGS_PRINT_SETTINGS}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;

    }
}


/**
 *
 * @type {Function}
 * */
flexiciousNmsp.SaveSettingsPopup = SaveSettingsPopup; //add to name space
SaveSettingsPopup.prototype.typeName = SaveSettingsPopup.typeName = 'SaveSettingsPopup';//for quick inspection