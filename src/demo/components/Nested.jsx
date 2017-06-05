import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, ReactDataGridColumnGroup, DatePicker, ComboBox } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import BusinessService from '../mockdata/BusinessService'
export default class Nested extends React.Component {
  componentDidMount() {
    const grid = this.grid;
    BusinessService.getInstance().getDeepOrgList(function (evt, token) {
      grid.setDataProvider(evt.result);
      grid.hideSpinner();
    });
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Nested Data</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid minWidth={"600px"} width={"100%"} ref={(grid) => { this.grid = grid; }}  enableEagerDraw showSpinnerOnFilterPageSort enablePrint enableMultiColumnSort enablePreferencePersistence enableDrillDown enableExport enableCopy enableSelectionCascade
            enableSelectionBubble enableTriStateCheckbox preferencePersistenceKey={"nesteddata"} 
            doubleClickEnabled horizontalScrollPolicy={"auto"}  >
            <ReactDataGridColumnLevel enableFilters enablePaging initialSortField={"legalName"} pageSize={20} childrenField={"deals"} enableFooters selectedKeyField={"id"}										  >
              <ReactDataGridColumn editable itemEditorApplyOnValueCommit id={"date"} itemEditor={flexiciousNmsp.DatePicker} dataField={"addedDate"}
                headerText={"Date Added"} filterControl={"DateComboBox"} labelFunction={UIUtils.dataGridFormatDateLabelFunction}
                filterDateRangeOptions={"[flexiciousNmsp.DateRange.DATE_RANGE_THISQUARTER,flexiciousNmsp.DateRange.DATE_RANGE_LASTQUARTER,flexiciousNmsp.DateRange.DATE_RANGE_THISYEAR,flexiciousNmsp.DateRange.DATE_RANGE_LASTYEAR,flexiciousNmsp.DateRange.DATE_RANGE_CUSTOM]"} />
              <ReactDataGridColumn type={"checkbox"} />
              <ReactDataGridColumn editable id={"colId"} dataField={"id"} headerText={"ID"} filterControl={"TextInput"} />
              <ReactDataGridColumn id={"colLegalName"} editable enableCellClickRowSelect={false} truncateToFit useUnderLine
                useHandCursor filterControl={"TextInput"} headerWordWrap filterWaterMark={"Search"} paddingLeft={"18"}
                filterIcon={"http://www.htmltreegrid.com/demo/flexicious/css/images/search_clear.png"} clearFilterOnIconClick
                showClearIconWhenHasText dataField={"legalName"} headerText={"Legal Name of the Organization"} />
              <ReactDataGridColumnGroup headerText={"Address"}>
                <ReactDataGridColumnGroup headerText={"Lines"} >
                  <ReactDataGridColumn enableCellClickRowSelect={false} id={"colLine1"} dataField={"headquarterAddress.line1"} headerText={"Line 1"}
                    footerLabel={"Count:"} footerOperation={"count"} />
                  <ReactDataGridColumn enableCellClickRowSelect={false} id={"colLine2"} dataField={"headquarterAddress.line2"} headerText={"Line 2"} />
                </ReactDataGridColumnGroup>
                <ReactDataGridColumnGroup headerText={"Region"}>
                  <ReactDataGridColumn id={"colCity"} dataField={"headquarterAddress.city.name"} headerText={"City"} filterControl={"ComboBox"}
                    filterComboBoxBuildFromGrid  />
                  <ReactDataGridColumn id={"colState"} editable itemEditor={flexiciousNmsp.ComboBox} itemEditorApplyOnValueCommit useFilterDataProviderForItemEditor
                    dataField={"headquarterAddress.state.name"} headerText={"State"} filterControl={"MultiSelectComboBox"} filterComboBoxBuildFromGrid  />
                  <ReactDataGridColumn id={"colCountry"} dataField={"headquarterAddress.country.name"} headerText={"Country"} filterControl={"MultiSelectComboBox"}
                    filterComboBoxBuildFromGrid  />
                </ReactDataGridColumnGroup>
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnGroup headerText={"Financials"} >
                <ReactDataGridColumn id={"colAnnRev"} editable dataField={"annualRevenue"} headerText={"Annual Revenue"} textAlign={"right"} headerAlign={"center"}
                  footerLabel={"Avg:"} footerOperation={"average"} footerAlign={"center"} footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                  labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn id={"colNumEmp"} editable dataField={"numEmployees"} headerText={"Num Employees"} textAlign={"right"} footerLabel={"Avg:"}
                  footerOperation={"average"} footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                  labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn id={"colEPS"} editable dataField={"earningsPerShare"} headerText={"EPS"} textAlign={"right"} footerLabel={"Avg:"}
                  footerOperation={"average"} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn id={"colStockPrice"} editable dataField={"lastStockPrice"} headerText={"Stock Price"} textAlign={"right"} footerLabel={"Avg:"}
                  footerOperation={"average"} footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                  labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnLevel childrenField={"invoices"} enableFooters selectedKeyField={"id"} nestIndent={30} initialSortField={"dealDate"}
                initialSortAscending={false} parentField={"customer"}>
                <ReactDataGridColumn type={"checkbox"} />
                <ReactDataGridColumn dataField={"dealDescription"} headerText={"Deal Description"} footerLabel={"Count:"} footerOperation={"count"} footerAlign={"center"} />
                <ReactDataGridColumn dataField={"dealAmount"} headerText={"Deal Amount"} textAlign={"right"} footerLabel={"Total:"} footerOperation={"sum"}
                  footerAlign={"right"} footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                  labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn dataField={"dealDate"} headerText={"Deal Date"} labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumn headerText={""} excludeFromSettings excludeFromPrint excludeFromExport paddingLeft={"0"} paddingRight={"0"} width={1} minWidth={1} />
                <ReactDataGridColumnLevel childrenField={"lineItems"} enableFooters enablePaging={false} forcePagerRow pageSize={3} selectedKeyField={"id"}
                  parentField={"deal"} nestIndent={30}>
                  <ReactDataGridColumn type={"checkbox"} />
                  <ReactDataGridColumn dataField={"id"} headerText={"Invoice Number"} footerLabel={"Count:"} footerOperation={"count"} footerAlign={"center"} />
                  <ReactDataGridColumn dataField={"invoiceAmount"} headerText={"Invoice Amount"} textAlign={"right"} footerLabel={"Total:"} footerOperation={"sum"}
                    footerAlign={"right"} footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                    labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                  <ReactDataGridColumn dataField={"invoiceStatus.name"} headerText={"Invoice Status"} />
                  <ReactDataGridColumn dataField={"invoiceDate"} headerText={"Invoice Date"} labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                  <ReactDataGridColumn dataField={"dueDate"} headerText={"Due Date"} labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                  <ReactDataGridColumn headerText={""} excludeFromSettings excludeFromPrint excludeFromExport paddingLeft={"0"} paddingRight={"0"} width={1} minWidth={1} />
                  <ReactDataGridColumnLevel enableFooters selectedKeyField={"id"} parentField={"invoice"} nestIndent={30}>
                    <ReactDataGridColumn type={"checkbox"} />
                    <ReactDataGridColumn dataField={"lineItemDescription"} headerText={"Line Item Description"} footerLabel={"Count:"} footerOperation={"count"}
                      footerAlign={"center"} />
                    <ReactDataGridColumn dataField={"lineItemAmount"} headerText={"Line Item Amount"} textAlign={"right"}
                      labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                    <ReactDataGridColumn headerText={""} excludeFromSettings excludeFromPrint excludeFromExport paddingLeft={"0"} paddingRight={"0"} width={1} minWidth={1} />
                  </ReactDataGridColumnLevel>
                </ReactDataGridColumnLevel>
              </ReactDataGridColumnLevel>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
} 
