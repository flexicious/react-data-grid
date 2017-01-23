import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants, ClassFactory, UIComponent, ToolbarAction } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SampleData from '../mockdata/SampleData'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { Tab, Tabs } from 'material-ui/Tabs';


export default class DynamicColumnGroups extends React.Component {
  constructor() {
    super();
    this.gridStyle = {
      /**
       * Usually the toolbar root is the same as the images root, but for some custom themes, we have their own icons.
       */
      //toolbarImagesRoot:flexiciousNmsp.Constants.IMAGE_PATH + "/themeIcons/itunes/32",

      pagerStyleName: "whiteText",
      headerStyleName: "header",
      columnGroupStyleName: "columnGroup",
      footerStyleName: "footer",
      selectionColor: [0xFABB39, 0xFABB39],
      rollOverColor: 0x8c8989,
      headerColors: 0x8c8989,
      pagerColors: 0x8c8989,
      columnGroupColors: 0xcfcfcf,
      filterColors: 0xe8e8e8,
      borderColor: 0x000000,

      columnGroupVerticalGridLineColor: 0x515151,
      columnGroupVerticalGridLines: true,
      columnGroupVerticalGridLineThickness: 2,

      columnGroupHorizontalGridLineColor: 0x515151,
      columnGroupHorizontalGridLines: true,
      columnGroupHorizontalGridLineThickness: 1,
      columnGroupDrawTopBorder: false,

      pagerHorizontalGridLineColor: 0x515151,
      pagerHorizontalGridLines: true,
      pagerHorizontalGridLineThickness: 2,
    }
  }


  getColumnTextColor(cell) {
    if (cell.rowInfo.getData().type_2 > 5) {
      return 0xCC3300;
    }
    return null;
  }
  componentDidMount() {
    const grid = this.refs.grid;
  }

  handleChange(newValue) {
    const grid = this.refs.grid;
    var columnsIndex;
    var index = 1;
    if (newValue == 1)
      columnsIndex = [1, 2, 3];
    else if (newValue == 2)
      columnsIndex = [4, 5, 6, 7];
    else
      columnsIndex = [8, 9, 10];

    var columns = grid.getColumns();
    var columnGroups = grid.getColumnGroups();
    for (var i = 0; i < columnGroups.length; i++) {
      var columns = columnGroups[i].getColumns();
      for (var j = 0; j < columns.length; j++) {
        var column = columns[j];
        var headerText = column.getHeaderText();
        column.setVisible(false);
        for (var k = 0; k < columnsIndex.length; k++) {
          var columnLabel = "Column_" + columnsIndex[k];
          if (headerText != null) {
            if (headerText == columnLabel) {
              column.setVisible(true);
              break;
            }
          }
        }
      }
    }
    grid.rebuild();
  };

  render() {
    return (
      <div>
        <h1 className='page-title'>Dynamic Column Groups/Custom Settings Popup</h1>
        <FullWidthSection useContent={true}>
          <div>
            <Tabs id="selectColumnGroup" value={0} onChange={this.handleChange.bind(this)}>
              <Tab label="Cols 1-3" value={1} />
              <Tab label="Cols 4-7" value={2} />
              <Tab label="Cols 8-10" value={3} />
            </Tabs>
          </div>
          <ReactDataGrid styles={this.gridStyle} enableActiveCellHighlight={false} popupFactorySettingsPopup={new ClassFactory(CustomSettingsPopup)} width={"100%"} ref="grid" preferencePersistenceKey="DynamicColumnGroups" dataProvider={SampleData.salesData}
            enablePrint enablePreferencePersistence horizontalScrollPolicy="auto" enableExport forcePagerRow enableFilters enableFooters >
            <ReactDataGridColumn dataField="investor" headerText="Investor" headerAlign="center" filterControl="TextInput"
              cellTextColorFunction={this.getColumnTextColor} filterComboBoxBuildFromGrid columnLockMode="left" footerOperation="count" footerOperationPrecision={0} />
            <ReactDataGridColumn dataField="salesPerson" headerText="Sales Person" headerAlign="center" filterControl="TextInput"
              filterComboBoxBuildFromGrid columnLockMode="left" />
            <ReactDataGridColumn dataField="desk" headerText="Desk" headerAlign="center" filterControl="ComboBox"
              filterComboBoxBuildFromGrid columnLockMode="left" />


            <ReactDataGridColumn excludeFromSettings excludeFromPrint excludeFromExport width="2" columnWidthMode="fixed" />


          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


let DynamicColumns_counter = 0;
const uiUtil = flexiciousNmsp.UIUtils;
const flxConstants = flexiciousNmsp.Constants;

/**
 * A CustomSettingsPopup that which can be used within the filtering/binding infrastructure.
 * @constructor
 * @class CustomSettingsPopup
 * @namespace flexiciousNmsp
 * @extends UIComponent
 */

class CustomSettingsPopup extends UIComponent {
  constructor() {
    super({}, "div")
    this.attachClass("flexiciousGrid");
    this.setWidth(800);
    this.setHeight(600);
    this.selectedChildColumns = {};

  }

  /**
   *
   * @return {Array}
   */
  getClassNames() {
    return ["CustomSettingsPopup", "UIComponent"];
  }

  /**
   *
   * @param val
   */
  setGrid(val) {
    this.grid = val;
    const visibleCols = [];
    const cols = this.grid.getSettingsColumns();
    for (var i = 0; i < cols.length; i++) {
      var col = cols[i];
      if (col._headerText == "Investor" || col._headerText == "Sales Person" || col._headerText == "Desk") {
        if (col.getVisible())
          visibleCols.push(col);
      }
    }
    this.selectedChildColumns = this.grid.selectedChildColumns ? this.grid.selectedChildColumns.slice() : [];
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
  onOK() {
    let allGroupedColumns = [];
    const collection = this.selectedColumns;
    const cols = this.grid.getSettingsColumns();
    const items = this.grid.getColumns();
    this.grid.excelOptions.columnsToExport = [];
    this.grid.selectedChildColumns = this.selectedChildColumns.slice();
    for (var i = 0; i < cols.length; i++) {
      var col = cols[i];
      if (col._headerText == "Investor" || col._headerText == "Sales Person" || col._headerText == "Desk") {

      }
      else
        this.grid.removeColumn(col);
    }

    for (const col of items) {
      if (cols.includes(col)) {
        col.setVisible(collection.includes(col));
        if (col.getVisible()) {
          this.grid.excelOptions.columnsToExport.push(col);
        }
      }
      allGroupedColumns.push(col);
    }



    const columnGroupHeaderText = ["AAPL 3YR Fixed", "AAPL 5YR Fixed", "AAPL 10YR Fixed", "AAPL 15YR Fixed ", "AAPL 30YR Fixed"];
    for (let j = 0; j < columnGroupHeaderText.length; j++) {
      const columnGroup = new flexiciousNmsp.FlexDataGridColumnGroup();
      columnGroup.setHeaderText(columnGroupHeaderText[j]);

      const dynamicColumns = [];
      for (var i = 1; i <= 10; i++) {
        if (this.selectedChildColumns[i]) {
          var col = DynamicColumns_addColumn(`type_${i}`, `Column_${i}`);
          if (i == 1)
            col.setLabelFunction2(getColumn1Label);
          else if (i == 2) {
            col.cellBackgroundColorFunction = getColumn2Background;
            col.footerOperation = "sum"
          } else if (i == 3)
            col.cellBackgroundColorFunction = getColumn3Background;
          col.setWidth(100);
          dynamicColumns.push(col);
        }
      }

      columnGroup.setGroupedColumns(dynamicColumns);
      allGroupedColumns.push(columnGroup);
    }

    this.grid.setGroupedColumns(allGroupedColumns);
    allGroupedColumns = null;

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
      <div style={{ float: "left" }}>{Constants.SETTINGS_COLUMNS_TO_SHOW}
        <ReactDataGrid width={300} height={300} dataProvider={this._cols} enableActiveCellHighlight={false}
          selectedObjects={(this._cols.length != this._visibleCols.length) ? this._visibleCols : this._cols}
          onChange={(evt) => { this.selectedColumns = evt.grid.getSelectedObjects() } }>
          <ReactDataGridColumn type={"checkbox"} />
          <ReactDataGridColumn dataField={"_headerText"} headerText={Constants.SETTINGS_COLUMNS_TO_SHOW} />
        </ReactDataGrid>
      </div>
      <div style={{ float: "right" }}>
        <Checkbox className={"cbFooter"} defaultChecked={this._footerVisible} style={this._enableFooters ? {} : { "visibility": "hidden" }}
          onCheck={(evt, newValue) => { this._footerVisible = newValue } } label={Constants.SETTINGS_SHOW_FOOTERS} />
        <Checkbox className={"cbFilters"} defaultChecked={this._filterVisible} style={this._enableFilters ? {} : { "visibility": "hidden" }}
          onCheck={(evt, newValue) => { this._filterVisible = newValue } } label={Constants.SETTINGS_SHOW_FILTER} />
        <div>
          <span>{Constants.SETTINGS_RECORDS_PER_PAGE + "  "}</span>
          <TextField name="perPage" className={"txtPageSize"} defaultValue={this._pageSize || 50}
            onChange={(evt) => { this._pageSize = parseInt(evt.currentTarget.value) } } />
        </div>

        <Checkbox defaultChecked={this.selectedChildColumns[1]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[1] = newValue } } label="Column 1" />
        <Checkbox defaultChecked={this.selectedChildColumns[2]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[2] = newValue } } label="Column 2" />
        <Checkbox defaultChecked={this.selectedChildColumns[3]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[3] = newValue } } label="Column 3" />
        <Checkbox defaultChecked={this.selectedChildColumns[4]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[4] = newValue } } label="Column 4" />
        <Checkbox defaultChecked={this.selectedChildColumns[5]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[5] = newValue } } label="Column 5" />
        <Checkbox defaultChecked={this.selectedChildColumns[6]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[6] = newValue } } label="Column 6" />
        <Checkbox defaultChecked={this.selectedChildColumns[7]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[7] = newValue } } label="Column 7" />
        <Checkbox defaultChecked={this.selectedChildColumns[8]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[8] = newValue } } label="Column 8" />
        <Checkbox defaultChecked={this.selectedChildColumns[9]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[9] = newValue } } label="Column 9" />
        <Checkbox defaultChecked={this.selectedChildColumns[10]}
          onCheck={(evt, newValue) => { this.selectedChildColumns[10] = newValue } } label="Column 10" />


      </div>
    </div>;
  }
}

const DynamicColumns_addColumn = (dataField, headerText) => {
  const dgCol = new flexiciousNmsp.FlexDataGridColumn();
  dgCol.setDataField(dataField);
  dgCol.setHeaderText(headerText);
  //because columns are having the same header text, we need to provide unique identifiers.
  dgCol.setUniqueIdentifier(`${headerText}${DynamicColumns_counter++}`);
  dgCol.filterControl = "TextInput";
  dgCol.filterOperation = "BeginsWith";
  dgCol.filterWaterMark = "Begins With";
  dgCol.headerAlign = "center";
  dgCol.textAlign = "center";
  return dgCol;
};

const DynamicColumnsGroup_addColumnGroup = headerText => {
  const dgCol = new flexiciousNmsp.FlexDataGridColumnGroup();
  dgCol.setHeaderText(headerText);
  dgCol.headerAlign = "center";
  dgCol.visible = true;
  return dgCol;
};

const getColumn2Background = cell => {
  if (cell.rowInfo.getData().type_2 > 5) {
    return '0xceefd0';
  }
  else
    return '0xefcece';
};

const getColumn3Background = cell => {
  if (cell.rowInfo.getData().type_3 == "Person 2") {
    return '0xceefd0';
  }
  else
    return '0xefcece';
};

const getColumn1Label = (item, column) => {
  if (item.type_2 < 6) {
    return "<img src='images/downIcon.png'>";
  }
  else {
    return "<img src='images/upIcon.png'>";
  }
};