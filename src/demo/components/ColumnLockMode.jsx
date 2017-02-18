import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn,ReactDataGridColumnGroup } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget'; 
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'


export default class ColumnLockMode extends React.Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>Column Lock Modes</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid width={"100%"} enablePrint enablePreferencePersistence enableExport enableCopy horizontalScrollPolicy="auto"
            preferencePersistenceKey="columnLockModes" useCompactPreferences enableMultiColumnSort dataProvider={FlexiciousMockGenerator.instance().getFlatOrgList()} >
            <ReactDataGridColumnLevel selectedKeyField="id" enablePaging pageSize={50} enableFilters enableFooters>
              <ReactDataGridColumn dataField="orgIndex" headerText="orgIndex" />
              <ReactDataGridColumn id="colId" dataField="id" headerText="ID" filterControl="TextInput" columnLockMode="left" />
              <ReactDataGridColumn id="colLegalName" dataField="legalName" headerText="Legal Name" columnLockMode="left" />
              <ReactDataGridColumnGroup headerText="Address">
                <ReactDataGridColumnGroup headerText="Lines" >
                  <ReactDataGridColumn id="colLine1" dataField="headquarterAddress.line1" headerText="Address Line 1" footerLabel="Count:" footerOperation="count" />
                  <ReactDataGridColumn id="colLine2" dataField="headquarterAddress.line2" headerText="Address Line 2" />
                </ReactDataGridColumnGroup>
                <ReactDataGridColumnGroup headerText="Region">
                  <ReactDataGridColumn id="colCity" dataField="headquarterAddress.city.name" headerText="City" filterControl="MultiSelectComboBox"
                    filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
                  <ReactDataGridColumn id="colState" dataField="headquarterAddress.state.name" headerText="State" filterControl="MultiSelectComboBox"
                    filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
                  <ReactDataGridColumn id="colCountry" dataField="headquarterAddress.country.name" headerText="Country" filterControl="MultiSelectComboBox"
                    filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
                </ReactDataGridColumnGroup>
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnGroup headerText="Financials" >
                <ReactDataGridColumn id="colAnnRev" dataField="annualRevenue" headerText="Annual Revenue" textAlign="right" headerAlign="right" width="100" headerAlign="center"
                  footerLabel="Avg:" footerOperation="average" footerAlign="center" footerOperationPrecision={2}
                  footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} columnLockMode="right" />
                <ReactDataGridColumn id="colNumEmp" dataField="numEmployees" headerText="Num Employees" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:"
                  footerOperation="average" footerOperationPrecision={2}
                  footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} columnLockMode="right" width="100" />
                <ReactDataGridColumn id="colEPS" dataField="earningsPerShare" headerText="EPS" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
                  footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} columnLockMode="right" width="100" />
                <ReactDataGridColumn id="colStockPrice" dataField="lastStockPrice" headerText="Stock Price" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:"
                  footerOperation="average" footerOperationPrecision={2}
                  footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} columnLockMode="right" width="100" />
              </ReactDataGridColumnGroup>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


