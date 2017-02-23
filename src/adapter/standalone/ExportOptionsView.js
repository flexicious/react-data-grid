/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
import UIUtils from '../../utils/UIUtils'
import Constants from '../../utils/Constants'
import UIComponent from '../../core/UIComponent'
import ComboBox from '../../controls/ComboBox'
import ReactDataGrid from '../../table/ReactDataGrid'
import ReactDataGridColumn from '../../table/ReactDataGridColumn'
import React from 'react'
import ToolbarAction from '../../flexgrid/valueobjects/ToolbarAction'
/**
 * A ExportOptionsView that which can be used within the filtering/binding infrastructure.
 * @constructor
 * @class ExportOptionsView
 * @namespace flexiciousNmsp
 * 
 */
export default class ExportOptionsView extends UIComponent {
    constructor() {
        super({}, "div")
        this.attachClass("flexiciousGrid");
        this.cbxColumns = new flexiciousNmsp.MultiSelectComboBox();
        this.cbxColumns.alwaysVisible = true;

        this.cbxExporters = new flexiciousNmsp.ComboBox();
        this.cbxExporters.ignoreAllItem = true;
        this.cbxExporters.setAddAllItem(false);
        this.setWidth(500);

        this.exportOptions = new flexiciousNmsp.ExportOptions();

    }

    /**
     *
     * @return {Array}
     */
    getClassNames() {
        return ["ExportOptionsView", "UIComponent"];
    }

    setGrid(val) {
        this.grid = val;
        this.enablePaging = val.getEnablePaging();
        this.pageCount = val.getPageSize() > 0 ? Math.ceil(val.getTotalRecords() / val.getPageSize()) : 1;
        this.selectedObjectsCount = val.getSelectedObjectsTopLevel().length;

        const items = this.grid.getExportableColumnsAtAllLevel(this.exportOptions);

        this.itemsToShow = [];

        for (const col of items) {
            if (col.getVisible()) {
                this.itemsToShow.push(col);
            }
        }

    }
    onOK(domElement) {

        const pagingRadios = UIUtils.findElementWithClassName(domElement, "flxsExportpaging");

        for (let i = 0; i <= pagingRadios.length; i++) {
            if (pagingRadios[i].checked == true) {
                this.exportOptions.printExportOption = pagingRadios[i].value;
                break;
            }
        }

        const pgFrom = parseInt(UIUtils.findElementWithClassName(domElement, 'txtPageFrom').value);
        const pgTo = parseInt(UIUtils.findElementWithClassName(domElement, 'txtPageTo').value);
        if (UIUtils.findElementWithClassName(domElement, 'RBN_SELECT_PGS').checked) {
            if (pgFrom >= 1 && pgTo >= 1 && pgFrom <= (this.pageCount) && pgTo <= (this.pageCount) && pgFrom <= pgTo) {
                this.exportOptions.pageFrom = pgFrom;
                this.exportOptions.pageTo = pgTo;
                this.close(Constants.ALERT_OK);

            } else {
                window.alert("Please ensure that the 'page from' is less than or equal to 'page to'");
            }
        }
        else {
            this.close(Constants.ALERT_OK);
        }
    }

    close(dialogResult) {
        const closeEvent = new flexiciousNmsp.BaseEvent(Constants.EVENT_CLOSE);
        closeEvent.detail = dialogResult;
        this.dispatchEvent(closeEvent);
        this.grid.removeChild(this.popup);
        //UIUtils.removePopUp(this);
    }


    onCancel(evt) {
        this.grid.removeChild(this.popup);
    }

    showDialog() {
        const actions = [ToolbarAction.create((this.exportOptions.openNewWindow ? Constants.PRT_BTN_PRINT_LABEL : Constants.EXP_BTN_EXPORT_LABEL), this.onOK.bind(this), true),
        ToolbarAction.create(Constants.EXP_BTN_CANCEL_LABEL, this.onCancel.bind(this), true),
        ];
        this.popup = UIUtils.addPopUp(this.render(), this.grid, false, null, Constants.SETTINGS_POPUP_TITLE, actions);
        this.grid.addChild(this.popup);
    }

    /**
     * Initializes the auto complete and watermark plugins
     */
    render() {
        return <div>
            <div className={"columnsLabel"} style={{float:"left"}}>{Constants.EXP_LBL_COLS_TO_EXPORT_TEXT}

                <ReactDataGrid width={300} height={300} selectedKeyField={"name"} dataProvider={this.exportOptions.availableColumns} enableActiveCellHighlight={false}
                    selectedKeys={this.itemsToShow.length?UIUtils.extractPropertyValues(this.itemsToShow,"uniqueIdentifier")
                    :UIUtils.extractPropertyValues(this.availableColumns,"name")} 
                    onChange={(evt) => {
                        this.exportOptions.columnsToExport = (evt.grid.getSelectedObjects());
                        if (this.exportOptions.columnsToExport.length == 1 && this.exportOptions.columnsToExport[0].name == "All") {
                            this.exportOptions.columnsToExport = [];
                        }
                    } }>
                    <ReactDataGridColumn type={"checkbox"} />
                    <ReactDataGridColumn dataField={"headerText"} headerText={Constants.SETTINGS_COLUMNS_TO_SHOW} />
                </ReactDataGrid>
            </div>
            <div className={"options flexiciousGrid"} style={{float:"right"}}>
                <input type={"radio"} className={"flxsExportpaging RBN_CURRENT_PAGE"} defaultChecked name='' value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE} />
                {Constants.EXP_RBN_CURRENT_PAGE_LABEL}<br />
                <input type={"radio"} className={"flxsExportpaging RBN_ALL_PAGES"} value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES} />
                {Constants.EXP_RBN_ALL_PAGES_LABEL}<br />
                <input type={"radio"} className={"flxsExportpaging RBN_SELECT_PGS"} value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES} />
                {Constants.EXP_RBN_SELECT_PGS_LABEL}<br />
                <input type={"number"} className={"flxsExportpaging txtPageFrom"} maxLength={5} />
                <label> {Constants.PGR_TO} </label>
                <input type={"number"} className={"txtPageTo"} maxLength={5} />
                <label>{this.pageCount}</label><br />
                <input disabled={this.selectedObjectsCount > 0} type={"radio"} className={"flxsExportpaging rbnSelectedRecords"}
                    value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS} />
                {Constants.SELECTED_RECORDS + "(" + this.selectedObjectsCount == 0 ? 'None Selected)' : this.selectedObjectsCount + " selected)"}
                <br />
                <label className={"LBL_EXPORT_FORMAT"}> {Constants.EXP_LBL_EXPORT_FORMAT_TEXT}</label>
                <select defaultValue={this.exportOptions.getExporterName()} onChange={(evt) => {
                    this.exportOptions.exporter = this.exportOptions.exporters[evt.currentTarget.selectedIndex];
                } }>
                    {this.exportOptions.exporters.map((exporter) => {
                        return <option value={exporter.getName()}>{exporter.getName()}</option>
                    })}
                </select>
            </div>
        </div>;
    }
}

flexiciousNmsp.ExportOptionsView = ExportOptionsView; //add to name space
ExportOptionsView.prototype.typeName = ExportOptionsView.typeName = 'ExportOptionsView';//for quick inspection