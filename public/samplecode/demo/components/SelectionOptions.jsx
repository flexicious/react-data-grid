import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, ReactDataGridColumnGroup } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

let cbDisable = false;
export default class SelectionOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedKeysTxt: "",
      unSelectedKeysTxt: "",
      openKeysTxt: ""
    }
    this.useSelectionExclusion = this.useSelectionExclusion.bind(this)
    this.selectionCascadeBubble = this.selectionCascadeBubble.bind(this)
    this.disableSelectionforaRow = this.disableSelectionforaRow.bind(this)
    this.clearOpenItemsonDataproviderRefresh = this.clearOpenItemsonDataproviderRefresh.bind(this)
    this.handleClearSelectedItemsonDataproviderRefresh = this.handleClearSelectedItemsonDataproviderRefresh.bind(this)
    this.btnRefreshclickHandler = this.btnRefreshclickHandler.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
  }

  componentDidMount() {
    const grid = this.grid;
    //grid.buildFromXml(FlexiciousMockGenerator.mockNestedXml);
    this.insertUIDColumn(grid.getColumnLevel());
    grid.setDataProvider(FlexiciousMockGenerator.getMockNestedData());
    grid.validateNow();
    grid.expandAll();
    grid.getColumnLevel().rowDisabledFunction = this.checkRowDisabled;
    this.changeHandler(null)
  }

  checkRowDisabled(cell, data) {
    if (!cbDisable) return false;
    return data.hasOwnProperty("title") && data.title == "Architect";
  };

  changeHandler(evt) {
    const grid = this.grid;
    if (!grid) return;
    const state = {
      selectedKeysTxt: (grid.getSelectedKeys().join("\n")),
      unSelectedKeysTxt: (grid.getUnSelectedKeys().join("\n")),
      openKeysTxt: (grid.getOpenKeys().join("\n"))
    }
    this.setState(state);
  };

  insertUIDColumn(columnLevel) {
    var cols = columnLevel.getColumns();
    var uuIdCol = new flexiciousNmsp.FlexDataGridColumn();
    uuIdCol.labelFunction = this.getUID;
    uuIdCol.setHeaderText("UID");
    cols.push(uuIdCol);
    columnLevel.setColumns(cols);
    if (columnLevel.nextLevel)
      this.insertUIDColumn(columnLevel.nextLevel);
  };

  getUID(item, col) {
    return item.toString();
  };

  useSelectionExclusion(evt, checked) {
    const grid = this.grid;
    grid.clearSelection();
    grid.enableSelectionExclusion = checked;
  };

  selectionCascadeBubble(evt, checked) {
    const grid = this.grid;
    grid.clearSelection();
    grid.enableSelectionCascade = checked;
    grid.enableSelectionBubble = checked;
    grid.enableTriStateCheckbox = checked;
  };

  disableSelectionforaRow(evt, checked) {
    const grid = this.grid;
    cbDisable = checked;
    grid.clearSelection();
    grid.redrawBody();
  };

  clearOpenItemsonDataproviderRefresh(evt, checked) {
    const grid = this.grid;
    grid.clearOpenItemsOnDataProviderChange = checked;
  };

  handleClearSelectedItemsonDataproviderRefresh(evt, checked) {
    const grid = this.grid;
    grid.clearSelectionOnDataProviderChange = checked;
  };

  btnRefreshclickHandler() {
    const grid = this.grid;
    grid.setDataProvider(FlexiciousMockGenerator.getMockNestedData());//the getter will create a new instance
    this.changeHandler(null);
  }

  getChanges() {
    const grid = this.grid;
    const state = {
      selectedKeysTxt: (grid.getSelectedKeys().join("\n")),
      unSelectedKeysTxt: (grid.getUnSelectedKeys().join("\n")),
      openKeysTxt: (grid.getOpenKeys().join("\n"))
    }
    this.setState(state);
  }





  render() {
    return (
      <div>
        <h1 className='page-title'>Selection Options</h1>
        <FullWidthSection useContent={true}>
          <div>
            <Checkbox onCheck={this.useSelectionExclusion} label="Use Selection Exclusion" />
            <Checkbox defaultChecked={true} onCheck={this.selectionCascadeBubble} label="Selection Cascade/Bubble" />
            <Checkbox onCheck={this.disableSelectionforaRow} label="Disable Selection for a Row" />
            <Checkbox onCheck={this.clearOpenItemsonDataproviderRefresh} label="Clear Open Items on Dataprovider Refresh" />
            <Checkbox onCheck={this.handleClearSelectedItemsonDataproviderRefresh} label="Clear Selected Items on Dataprovider Refresh" />
            <RaisedButton onClick={this.btnRefreshclickHandler} label={"Refresh DataProvider"} />
          </div>
          <div>
            <TextField ref="lblSelectedKeys" multiLine={true} rows={5} rowsMax={5} hintText="Selected Keys" value={this.state.selectedKeysTxt} />
            <TextField ref="lblUnSelectedKeys" multiLine={true} rows={5} rowsMax={5} hintText="UnSelected Keys" value={this.state.unSelectedKeysTxt} />
            <TextField ref="lblOpenKeys" multiLine={true} rows={5} rowsMax={5} hintText="Open Keys" value={this.state.openKeysTxt} />
          </div>


          <ReactDataGrid ref={(grid) => { this.grid = grid; }} width={"100%"} clearOpenItemsOnDataProviderChange={false}
            onChange={this.changeHandler}
            onItemOpen={this.changeHandler}
            onItemClose={this.changeHandler}
            clearSelectionOnDataProviderChange={false} forcePagerRow enableFilters enableMultiColumnSort builtInActions='sort,separator' styleName='FlexiciousGridStyle'
            enableSelectionCascade enableSelectionBubble enableTriStateCheckbox preferencePersistenceKey='selectionOptions'
            showSpinnerOnFilterPageSort enableDefaultDisclosureIcon={false} change={this.changeHandler} itemOpen={this.changeHandler}
            itemClose={this.changeHandler} enablePreferencePersistence >
            <ReactDataGridColumnLevel childrenField='items' enableFilters={false} nestIndent='20' selectedKeyField='employeeId'>
              <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings enableExpandCollapseIcon width='25' columnWidthMode='fixed' />
              <ReactDataGridColumn type='checkbox' />
              <ReactDataGridColumn headerText='Employee Name' editable dataField='employeeName' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Title' dataField='title' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Email Address' dataField='emailAddress' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Department' dataField='department' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Hire Date' dataField='hireDate' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField='items' headerVerticalGridLineThickness='1' selectedKeyField='projectId'>
                <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings enableExpandCollapseIcon width='50' columnWidthMode='fixed' expandCollapseIconLeft='25' />
                <ReactDataGridColumn type='checkbox' />
                <ReactDataGridColumn dataField='project' headerText='Project' />
                <ReactDataGridColumn dataField='roleOnProject' headerText='Role On Project' />
                <ReactDataGridColumn dataField='projectStartDate' headerText='Project Start' />
                <ReactDataGridColumn dataField='projectEndDate' headerText='Project End' />
                <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField='items' headerVerticalGridLineThickness='1' selectedKeyField='timesheetId'>
                  <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings width='75' columnWidthMode='fixed' />
                  <ReactDataGridColumn type='checkbox' />
                  <ReactDataGridColumn dataField='timeSheetTitle' headerText='TimeSheet Title' />
                  <ReactDataGridColumn dataField='hours' headerText='Hours' />
                  <ReactDataGridColumn dataField='rate' headerText='Rate' />
                  <ReactDataGridColumn dataField='totalExpense' headerText='Total Expense' />
                </ReactDataGridColumnLevel>
              </ReactDataGridColumnLevel>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>

        </FullWidthSection>
      </div>
    );
  }
}


