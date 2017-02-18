import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

export default class ExternalFilter extends React.Component {
  constructor() {
    super();
    this.cbtimesheet1 = true;
    this.cbtimesheet2 = true;
    this.handleSearchClick=this.handleSearchClick.bind(this);
  }

  componentDidMount() {
    const grid = this.grid;
    //dgMain.buildFromXml(xml);
    grid.setDataProvider(FlexiciousMockGenerator.getMockNestedData());
    grid.getColumnLevel().nextLevel.nextLevel.filterFunction=this.filterDeviceTypes.bind(this);
    grid.enableHeightAutoAdjust=true;
    grid.validateNow();
    grid.expandAll();

  }
 
handleSearchClick(event){
  const grid = this.grid;
  grid.processFilter();
};

filterDeviceTypes(item){

    if(! this.cbtimesheet1 && item.timeSheetTitle=='Time Sheet-1')
        return false;
    if(! this.cbtimesheet2 && item.timeSheetTitle=='Time Sheet-2')
        return false;
    return true;

};

  render() {
    return (
      <div>
        <h1 className='page-title'>External Filter</h1>
        <FullWidthSection useContent={true}>
          <CheckBox defaultChecked={true} label="Time Sheet-1" onCheck={(evt,newValue)=>{this.cbtimesheet1=newValue;}}/>
          <CheckBox defaultChecked={true} label="Time Sheet-2" onCheck={(evt,newValue)=>{this.cbtimesheet2=newValue;}}/>
          <RaisedButton onClick={this.handleSearchClick} label="Search" />
          <ReactDataGrid  width={"100%"}  ref={(grid) => { this.grid = grid; }} forcePagerRow enableFilters enableMultiColumnSort 
          builtInActions='sort,separator' styleName='FlexiciousGridStyle' preferencePersistenceKey='externalFilter' 
          enableSelectionCascade enableSelectionBubble enableTriStateCheckbox showSpinnerOnFilterPageSort 
          enableDefaultDisclosureIcon={false}>
            <ReactDataGridColumnLevel childrenField='items' enableFilters={false} nestIndent='20'>
              <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings enableExpandCollapseIcon width='25' columnWidthMode='fixed' />
              <ReactDataGridColumn type='checkbox' />
              <ReactDataGridColumn headerText='Employee Name' dataField='employeeName' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Title' dataField='title' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Email Address' dataField='emailAddress' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Department' dataField='department' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Hire Date' dataField='hireDate' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField='items' headerVerticalGridLineThickness='1' >
                <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings enableExpandCollapseIcon width='50' columnWidthMode='fixed' expandCollapseIconLeft='25' />
                <ReactDataGridColumn type='checkbox' />
                <ReactDataGridColumn dataField='project' headerText='Project' />
                <ReactDataGridColumn dataField='roleOnProject' headerText='Role On Project' />
                <ReactDataGridColumn dataField='projectStartDate' headerText='Project Start' />
                <ReactDataGridColumn dataField='projectEndDate' headerText='Project End' />
                <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField='items' headerVerticalGridLineThickness='1'  >
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


