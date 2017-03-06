
import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Employee from '../mockdata/Employee.js';

export default class CustomFooter extends React.Component {
  constructor() {
    super();
    this.getSalaryFooter = this.getSalaryFooter.bind(this);
  }
 
  getSalaryFooter(col) {
    const grid = col.level.grid;
    return <div>
      <div style={{textAlign:'right'}}> Avg: {flexiciousNmsp.UIUtils.formatCurrency(flexiciousNmsp.UIUtils.average(grid.getDataProvider(), "annualSalary"))}</div>
      <div style={{textAlign:'right'}}> Min: {flexiciousNmsp.UIUtils.formatCurrency(flexiciousNmsp.UIUtils.min(grid.getDataProvider(), "annualSalary"))}</div>
      <div style={{textAlign:'right'}}> Max: {flexiciousNmsp.UIUtils.formatCurrency(flexiciousNmsp.UIUtils.max(grid.getDataProvider(), "annualSalary"))}</div>
    </div> 
  };

  render() {
    return (
      <div>
        <h1 className='page-title'>Custom Footer</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid width={"100%"} enableFilters enableCopy enableFooters enablePaging dataProvider={Employee.getAllEmployees()} pageSize={25} filterRowHeight={25} footerRowHeight={70} >
            <ReactDataGridColumnLevel>
              <ReactDataGridColumn type="checkbox" selectedKeyField="employeeId" />
              <ReactDataGridColumn headerText="ID" dataField="employeeId" filterOperation="Contains" filterControl="TextInput" filterTriggerEvent="enterKeyUp" />
              <ReactDataGridColumn headerText="Name" />
              <ReactDataGridColumn textAlign="right" headerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} width="100" headerText="Annual Salary" dataField="annualSalary"
                filterControl="NumericRangeBox" filterTriggerEvent="enterKeyUp" footerLabelFunction={this.getSalaryFooter} />
              <ReactDataGridColumn headerText="State" dataField="stateCode" />
              <ReactDataGridColumn headerText="Department" dataField="department" filterOperation="Equals" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid />
              <ReactDataGridColumn headerText="Phone" dataField="phoneNumber" />
              <ReactDataGridColumn headerText="Active" dataField="isActive" filterOperation="Equals" filterControl="TriStateCheckBox" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn headerText="Hire Date" dataField="hireDate" filterControl="DateComboBox" labelFunction={UIUtils.dataGridFormatDateLabelFunction}
                filterDateRangeOptions="[flexiciousNmsp.DateRange.DATE_RANGE_THISQUARTER,flexiciousNmsp.DateRange.DATE_RANGE_LASTQUARTER,flexiciousNmsp.DateRange.DATE_RANGE_THISYEAR,flexiciousNmsp.DateRange.DATE_RANGE_LASTYEAR,flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM]" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


