/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
import { UIUtils, Constants, UIComponent, ComboBox, ReactDataGrid, ReactDataGridColumn, ToolbarAction } from './LibraryImports'
import React from 'react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'
/**
 * A ExportOptionsView that which can be used within the filtering/binding infrastructure.
 * @constructor
 * @class ExportOptionsView
 * @namespace flexiciousNmsp
 */
export default class MaterialExportOptionsView extends UIComponent {
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

        this.exportOptions.printExportOption = this.pageSelection;


        const pgFrom = this.pageFrom;
        const pgTo = this.pageTo;
        if (this.pageSelection == flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES) {
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
        this.grid.removePopup(this.popup);
        //UIUtils.removePopUp(this);
    }


    onCancel(evt) {
        this.grid.removePopup(this.popup);
    }

    showDialog() {
        const actions = [ToolbarAction.create((this.exportOptions.openNewWindow ? Constants.PRT_BTN_PRINT_LABEL : Constants.EXP_BTN_EXPORT_LABEL), this.onOK.bind(this), true),
        ToolbarAction.create(Constants.EXP_BTN_CANCEL_LABEL, this.onCancel.bind(this), true),
        ];
        this.popup = UIUtils.addPopUp(this.render(), this.grid, false, null, Constants.SETTINGS_POPUP_TITLE, actions);
        this.grid.addPopup(this.popup);
    }

    /**
     * Initializes the auto complete and watermark plugins
     */
    render() {
        return <div key="exportdiv">
            <div key="columnsDiv" className={"columnsLabel"} style={{ float: "left" }}>{Constants.EXP_LBL_COLS_TO_EXPORT_TEXT}

                <ReactDataGrid key="columnsGrid" width={300} height={300} selectedKeyField={"name"} dataProvider={this.exportOptions.availableColumns} enableActiveCellHighlight={false}
                    selectedKeys={this.itemsToShow.length ? UIUtils.extractPropertyValues(this.itemsToShow, "uniqueIdentifier")
                        : UIUtils.extractPropertyValues(this.availableColumns, "name")}
                    onChange={(evt) => {
                        this.exportOptions.columnsToExport = (evt.grid.getSelectedObjects());
                        if (this.exportOptions.columnsToExport.length == 1 && this.exportOptions.columnsToExport[0].name == "All") {
                            this.exportOptions.columnsToExport = [];
                        }
                    } }>
                    <ReactDataGridColumn type={"checkbox"} />
                    <ReactDataGridColumn dataField={"headerText"} headerText={Constants.EXP_LBL_COLS_TO_EXPORT_TEXT} />
                </ReactDataGrid>
            </div>
            <div key="optionsDiv" className={"options flexiciousGrid"} style={{ float: "right" }}>
                <RadioButtonGroup name="pageSelection" onChange={(evt, newValue) => { this.pageSelection = newValue; } } defaultSelected={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE}>
                    <RadioButton name="currentPage" label={Constants.EXP_RBN_CURRENT_PAGE_LABEL} className={"flxsExportpaging RBN_CURRENT_PAGE"} value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_CURRENT_PAGE} />
                    <RadioButton name="allPages" label={Constants.EXP_RBN_ALL_PAGES_LABEL} className={"flxsExportpaging RBN_ALL_PAGES"} value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_ALL_PAGES} />
                    <RadioButton disabled={this.selectedObjectsCount == 0} className={"flxsExportpaging rbnSelectedRecords"}
                        value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_RECORDS} label={Constants.SELECTED_RECORDS + " (" + (this.selectedObjectsCount == 0 ? 'None Selected)' : this.selectedObjectsCount + " selected)")} />
                    <RadioButton name="selectedPage" label={Constants.EXP_RBN_SELECT_PGS_LABEL} className={"flxsExportpaging RBN_SELECT_PGS"}
                        value={flexiciousNmsp.PrintExportOptions.PRINT_EXPORT_SELECTED_PAGES} />
                </RadioButtonGroup>
                <TextField style={{ width: 'auto' }} key="fromPage" name="fromPage" className={"flxsExportpaging txtPageFrom"} onChange={(evt, newValue) => { this.pageTo = newValue; } } />
                <label> {Constants.PGR_TO} </label>
                <TextField style={{ width: 'auto' }} key="toPage" name="toPage" className={"flxsExportpaging txtPageTo"} onChange={(evt, newValue) => { this.pageFrom = newValue; } } />
                <label>{this.pageCount}</label>
                <div>

                    <label className={"LBL_EXPORT_FORMAT"}> {Constants.EXP_LBL_EXPORT_FORMAT_TEXT}</label>
                    <select defaultValue={this.exportOptions.getExporterName()} onChange={(evt) => {
                        this.exportOptions.exporter = this.exportOptions.exporters[evt.currentTarget.selectedIndex];
                    } }>
                        {this.exportOptions.exporters.map((exporter, i) => {
                            return <option key={"option" + i} value={exporter.getName()}>{exporter.getName()}</option>
                        })}
                    </select>
                </div>
            </div>
        </div>;
    }
}

flexiciousNmsp.MaterialExportOptionsView = MaterialExportOptionsView; //add to name space
MaterialExportOptionsView.prototype.typeName = MaterialExportOptionsView.typeName = 'MaterialExportOptionsView';//for quick inspection