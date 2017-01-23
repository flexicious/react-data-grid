import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

export default class ChangeTrackingAPI extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.refs.grid;
    grid.setDataProvider(FlexiciousMockGenerator.getMockNestedData());
    grid.validateNow();
    grid.expandAll();

  }

  getChanges(event){
    const grid = this.refs.grid;
    chagesDisplayField.value = grid.getChanges();
  };

  getCellBackgroundColor (cell){
    const grid = this.refs.grid;
    if(!cell.getRowInfo().getIsDataRow() || cell.level.grid.implementsOrExtends("IPrintDatagrid")){
        return null;
    } 
    for(var i=0;i<grid.getChanges().length;i++){
        var changeInfo=grid.getChanges()[i];
        if(changeInfo.changedItem == cell.getRowInfo().getData()
            && changeInfo.changedProperty == cell.getColumn().dataField
            && changeInfo.previousValue!=changeInfo.newValue){
                return 0x119933;
        }
    }
    return null;
  };

  onRowChanged (evt){
  //    if(!grid||!document.getElementById('exampleHTML'))return;
  //    var textArea = document.getElementById('exampleHTML').contentWindow.document.getElementById('txtChanges');
  //    if(!textArea)return;
  //    textArea.value = grid.getChanges().join("\n");
  };


  render() {
    return (
      <div>
        <h1 className='page-title'>Change Tracking API</h1>
        <FullWidthSection useContent={true}>
        <TextField id="chagesDisplayField" disabled={true}/>
         <RaisedButton onTouchTap={this.getChanges.bind(this)} label={"Get Changes"} />
          <ReactDataGrid width={"100%"} ref="grid" editable={true} forcePagerRow enableFilters enableMultiColumnSort builtInActions="sort,separator" styleName="FlexiciousGridStyle" enableSelectionCascade enableSelectionBubble enableTriStateCheckbox showSpinnerOnFilterPageSort enableDefaultDisclosureIcon={false} preferencePersistenceKey="changeTrackingAPI" onrowChanged={this.onRowChanged} cellBackgroundColorFunction={this.getCellBackgroundColor.bind(this)} enableTrackChanges>
            <ReactDataGridColumnLevel childrenField="items" enableFilters={false} nestIndent={20} width={"100%"} height="600" >
              <ReactDataGridColumn sortable={false} headerText="" excludeFromSettings enableExpandCollapseIcon width={25} columnWidthMode="fixed" editable={false} />
              <ReactDataGridColumn type="checkbox" />
              <ReactDataGridColumn headerText="Employee Name" dataField="employeeName" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn headerText="Title" dataField="title" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn headerText="Email Address" dataField="emailAddress" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn headerText="Department" dataField="department" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn headerText="Hire Date" dataField="hireDate" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField="items" headerVerticalGridLineThickness={1} >
                <ReactDataGridColumn sortable={false} headerText="" editable={false} excludeFromSettings enableExpandCollapseIcon width={50} columnWidthMode="fixed" expandCollapseIconLeft={25} />
                <ReactDataGridColumn type="checkbox" />
                <ReactDataGridColumn dataField="project" headerText="Project" />
                <ReactDataGridColumn dataField="roleOnProject" headerText="Role On Project" />
                <ReactDataGridColumn dataField="projectStartDate" headerText="Project Start" />
                <ReactDataGridColumn dataField="projectEndDate" headerText="Project End" />
                <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField="items" headerVerticalGridLineThickness={1}  >
                  <ReactDataGridColumn sortable={false} headerText="" editable={false} excludeFromSettings width="75" columnWidthMode="fixed" />
                  <ReactDataGridColumn type="checkbox" />
                  <ReactDataGridColumn dataField="timeSheetTitle" headerText="TimeSheet Title" />
                  <ReactDataGridColumn dataField="hours" headerText="Hours" />
                  <ReactDataGridColumn dataField="rate" headerText="Rate" />
                  <ReactDataGridColumn dataField="totalExpense" headerText="Total Expense" />
                </ReactDataGridColumnLevel>
              </ReactDataGridColumnLevel>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


