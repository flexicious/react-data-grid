/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
import { UIUtils, Constants, UIComponent,  ReactDataGrid, ReactDataGridColumn, ToolbarAction } from 'flexicious-react-datagrid'

import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
/**
 * A SettingsPopup that which can be used within the filtering/binding infrastructure.
 * @constructor
 * @class SettingsPopup
 * @namespace flexiciousNmsp
 * @extends UIComponent
 */

export default class MaterialSettingsPopup extends UIComponent {
    constructor() {
        super({}, "div")
        this.attachClass("flexiciousGrid");
        this.setWidth(800);
        this.setHeight(600);

    }

    /**
     *
     * @return {Array}
     */
    getClassNames() {
        return ["SettingsPopup", "UIComponent"];
    }

    /**
     *
     * @param val
     */
    setGrid(val) {
        this.grid = val;
        const visibleCols = [];
        const cols = this.grid.getSettingsColumns();

        for (const col of cols) {
            if (col.getVisible())
                visibleCols.push(col);
        }

        this._cols = cols;
        this._visibleCols = visibleCols;
        this._filterVisible = this.grid.getFilterVisible();
        this._footerVisible = this.grid.getFooterVisible();
        this._pageSize = this.grid.getPageSize();
        this._enablePaging = this.grid.getEnablePaging();
        this._enableFilters = this.grid.getEnableFilters();
        this._enableFooters = this.grid.getEnableFooters();

    }

    /**
     *
     * @type {on}
     */
    onOK(dialog) {
        const collection = this.selectedColumns;
        const cols = this.grid.getSettingsColumns();
        const items = this.grid.getColumns();
        this.grid.excelOptions.columnsToExport = [];

        for (const col of items) {
            if (cols.includes(col)) {
                col.setVisible(collection.includes(col));
                if (col.getVisible()) {
                    this.grid.excelOptions.columnsToExport.push(col);
                }
            }
        }

        if (this._enableFilters)
            this.grid.setFilterVisible(this._filterVisible);
        if (this._enableFooters)
            this.grid.setFooterVisible(this._footerVisible);
        this.grid.validateNow();
        if (this._enablePaging)
            this.grid.setPageSize(this._pageSize);
        this.grid.refreshLayout();
        this.grid.removePopup(this.popup);
    }

    /**
     *
     * @param evt
     */
    onCancel(evt) {
        this.grid.removePopup(this.popup);
    }
    showDialog() {
        const actions = [ToolbarAction.create(Constants.MCS_BTN_APPLY_LABEL, this.onOK.bind(this), true),
        ToolbarAction.create(Constants.MCS_BTN_CANCEL_LABEL, this.onCancel.bind(this), true),
        ];
        this.popup = UIUtils.addPopUp(this.render(), this.grid, false, null, Constants.SETTINGS_POPUP_TITLE, actions);
        this.grid.addPopup(this.popup);
    }

    render() {
        return <div className={"settingsPopup flexiciousPopup"}>
            <div className={"columnsLabel"}>{Constants.SETTINGS_COLUMNS_TO_SHOW}
                <ReactDataGrid width={"100%"} height={300} dataProvider={this._cols} enableActiveCellHighlight={false}
                    selectedObjects={(this._cols.length != this._visibleCols.length) ? this._visibleCols : this._cols}
                    onChange={(evt) => { this.selectedColumns = evt.grid.getSelectedObjects() } }>
                    <ReactDataGridColumn type={"checkbox"} />
                    <ReactDataGridColumn dataField={"_headerText"} headerText={Constants.SETTINGS_COLUMNS_TO_SHOW} />
                </ReactDataGrid>
            </div>
            <div className={"options"}>
                <Checkbox className={"cbFooter"} defaultChecked={this._footerVisible} style={this._enableFooters ? {} : { "visibility": "hidden" }}
                    onChange={(evt, newValue) => { this._footerVisible = newValue } } label={Constants.SETTINGS_SHOW_FOOTERS} />
                <Checkbox className={"cbFilters"} defaultChecked={this._filterVisible} style={this._enableFilters ? {} : { "visibility": "hidden" }}
                    onChange={(evt, newValue) => { this._filterVisible = newValue } } label={Constants.SETTINGS_SHOW_FILTER} />
                <div>
                    <span>{Constants.SETTINGS_RECORDS_PER_PAGE + "  "}</span>
                    <TextField name="perPage" style={{ width: 'auto' }} className={"txtPageSize"} defaultValue={this._pageSize || 50}
                        onChange={(evt) => { this._pageSize = parseInt(evt.currentTarget.value) } } />
                </div>
            </div>
        </div>;
    }
}

/**
 *
 * @type {Function}
                */
flexiciousNmsp.MaterialSettingsPopup = MaterialSettingsPopup; //add to name space
MaterialSettingsPopup.prototype.typeName = MaterialSettingsPopup.typeName = 'MaterialSettingsPopup';//for quick inspection