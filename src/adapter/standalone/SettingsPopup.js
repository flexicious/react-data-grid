/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */

import { UIUtils, Constants, UIComponent, ReactDataGrid, ReactDataGridColumn, ToolbarAction } from './LibraryImports'

import React from 'react'
/**
 * A SettingsPopup that which can be used within the filtering/binding infrastructure.
 * @constructor
 * @class SettingsPopup
 * @namespace flexiciousNmsp
 * 
 */

export default class SettingsPopup extends UIComponent {
    constructor() {
        super({}, "div")
        this.attachClass("flexiciousGrid");
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
        this.grid.removeChild(this.popup);
    }

    /**
     *
     * @param evt
     */
    onCancel(evt) {
        this.grid.removeChild(this.popup);
    }
    showDialog() {
        const actions = [ToolbarAction.create(Constants.MCS_BTN_APPLY_LABEL, this.onOK.bind(this), true),
            ToolbarAction.create(Constants.MCS_BTN_CANCEL_LABEL, this.onCancel.bind(this), true),
        ];
        this.popup = UIUtils.addPopUp(this.render(), this.grid, false, null, Constants.SETTINGS_POPUP_TITLE, actions);
        this.grid.addChild(this.popup);
    }
    getHeaderText(col) {
        return col._headerText || col.dataField;
    }
    render() {
        return <div className={"settingsPopup flexiciousPopup"} style={{ height: "400px", width: "600px" }}>
            <div className={"columnsLabel"}>{Constants.SETTINGS_COLUMNS_TO_SHOW}
                <ReactDataGrid width={400} height={300} dataProvider={this._cols} enableActiveCellHighlight={false}
                    selectedObjects={(this._cols.length != this._visibleCols.length) ? this._visibleCols : this._cols}
                    onChange={(evt) => { this.selectedColumns = evt.grid.getSelectedObjects() } }>
                    <ReactDataGridColumn type={"checkbox"} />
                    <ReactDataGridColumn labelFunction={this.getHeaderText} headerText={Constants.SETTINGS_COLUMNS_TO_SHOW} />
                </ReactDataGrid>
            </div>
            <div className={"options"}>
                <input type="checkbox" className={"cbFooter"} defaultChecked={this._footerVisible} style={this._enableFooters ? {} : { "visibility": "hidden" }}
                    onChange={(evt) => { this._footerVisible = evt.currentTarget.checked } } />
                <span style={this._enableFooters ? {} : { "visibility": "hidden" }}> {Constants.SETTINGS_SHOW_FOOTERS}</span>
                <br />
                <input type="checkbox" className={"cbFilters"} defaultChecked={this._filterVisible} style={this._enableFilters ? {} : { "visibility": "hidden" }}
                    onChange={(evt) => { this._filterVisible = evt.currentTarget.checked } } />
                <span style={this._enableFilters ? {} : { "visibility": "hidden" }}> {Constants.SETTINGS_SHOW_FILTER}</span>
                <br />
                <br />
                <div style={this._enablePaging ? {} : { "visibility": "hidden" }}>
                    <span>{Constants.SETTINGS_RECORDS_PER_PAGE}</span>
                    <input className={"txtPageSize"} type={"number"} defaultValue={this._pageSize || 50}
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
flexiciousNmsp.SettingsPopup = SettingsPopup; //add to name space
SettingsPopup.prototype.typeName = SettingsPopup.typeName = 'SettingsPopup';//for quick inspection