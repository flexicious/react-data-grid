import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'

import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Employee from '../mockdata/Employee.js';

export default class ColumnLockMode extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.refs.grid;
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Column Width Modes</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid dataProvider={Employee.getAllEmployees()} pageSize={25} width={"100%"} color="red" horizontalScrollPolicy="off">
            <ReactDataGridColumnLevel>
              <ReactDataGridColumn type="checkbox" columnWidthMode="fixed" width={30} selectedKeyField="employeeId" />
              <ReactDataGridColumn columnWidthMode="fitToContent" headerText="ID" dataField="employeeId" filterOperation="Contains" filterControl="TextInput" filterTriggerEvent="enterKeyUp" />
              <ReactDataGridColumn columnWidthMode="fitToContent" headerText="First Name" dataField="firstName" filterOperation="BeginsWith" filterControl="TextInput"
                filterTriggerEvent="enterKeyUp" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn columnWidthMode="fitToContent" headerText="Last Name" dataField="lastName" filterOperation="BeginsWith" filterControl="TextInput"
                filterTriggerEvent="enterKeyUp" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn columnWidthMode="fitToContent" percentWidth={25} headerText="Department" dataField="department" filterOperation="Equals" filterControl="MultiSelectComboBox"
                filterComboBoxBuildFromGrid filterComboBoxWidth="150" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn columnWidthMode="fixed" width="40" headerText="Active" dataField="isActive" filterOperation="Equals" filterControl="TriStateCheckBox"
                footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn columnWidthMode="percent" percentWidth="33" headerText="Phone" dataField="phoneNumber" filterOperation="Contains" filterControl="TextInput"
                filterTriggerEvent="enterKeyUp" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn columnWidthMode="percent" percentWidth="33" headerText="Hire Date" dataField="hireDate" filterControl="DateComboBox" labelFunction={UIUtils.dataGridFormatDateLabelFunction} filterDateRangeOptions="[flexiciousNmsp.DateRange.DATE_RANGE_THISQUARTER,flexiciousNmsp.DateRange.DATE_RANGE_LASTQUARTER,flexiciousNmsp.DateRange.DATE_RANGE_THISYEAR,flexiciousNmsp.DateRange.DATE_RANGE_LASTYEAR,flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM]" filterComboBoxWidth="150" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />
              <ReactDataGridColumn columnWidthMode="percent" percentWidth="33" textAlign="right" headerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} width="100" headerText="Annual Salary" dataField="annualSalary" filterControl="NumericRangeBox" filterTriggerEvent="enterKeyUp" />
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


