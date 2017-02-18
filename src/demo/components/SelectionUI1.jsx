import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator'
import SampleData from '../mockdata/SampleData'

import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class SelectionUI1 extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.grid;
    grid.setDataProvider(SampleData.sampleNestedData);
    grid.validateNow();
    grid.expandAll();
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Selection UI 1</h1>
        <FullWidthSection useContent={true}>


          <ReactDataGrid width={"100%"} ref={(grid) => { this.grid = grid; }} forcePagerRow enableFilters enableMultiColumnSort builtInActions='sort,separator' styleName='FlexiciousGridStyle' enableSelectionCascade enableSelectionBubble enableTriStateCheckbox preferencePersistenceKey='selectedUI1' showSpinnerOnFilterPageSort enableDefaultDisclosureIcon={false}>
            <ReactDataGridColumnLevel childrenField='items' enableFilters={false} nestIndent='20' selectedKeyField='employeeId'>
              <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings enableExpandCollapseIcon width='25' columnWidthMode='fixed' enableCellClickRowSelect={false} />
              <ReactDataGridColumn type='checkbox' />
              <ReactDataGridColumn headerText='Employee Name' dataField='employeeName' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Title' dataField='title' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Email Address' dataField='emailAddress' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Department' dataField='department' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumn headerText='Hire Date' dataField='hireDate' filterControl='TextInput' filterOperation='BeginsWith' />
              <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField='items' headerVerticalGridLineThickness='1' selectedKeyField='projectId'>
                <ReactDataGridColumn sortable={false} headerText='' excludeFromSettings enableExpandCollapseIcon width='50' columnWidthMode='fixed' expandCollapseIconLeft='25' enableCellClickRowSelect={false} />
                <ReactDataGridColumn type='checkbox' />
                <ReactDataGridColumn dataField='project' headerText='Project' />
                <ReactDataGridColumn dataField='roleOnProject' headerText='Role On Project' />
                <ReactDataGridColumn dataField='projectStartDate' headerText='Project Start' />
                <ReactDataGridColumn dataField='projectEndDate' headerText='Project End' />
                <ReactDataGridColumnLevel reusePreviousLevelColumns={false} childrenField='items' headerVerticalGridLineThickness='1' selectedKeyField='timesheetId' enableCellClickRowSelect={false}>
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


