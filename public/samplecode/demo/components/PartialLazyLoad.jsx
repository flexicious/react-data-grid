import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import BusinessService from '../mockdata/BusinessService'
export default class PartialLazyLoad extends React.Component {
  componentDidMount() {
    const grid = this.grid;
    flexiciousNmsp.BusinessService.getInstance().getFlatOrgList(function (evt, token) {
      grid.setPreservePager(true);
      grid.setDataProvider(evt.result);
      grid.hideSpinner();
    });
  }
  columnlevel1_itemLoadHandler(evt1) {
    const grid = this;
    var org = evt1.filter.parentObject;
    flexiciousNmsp.BusinessService.getInstance().getDeepOrg(org.id,
      function (evt, token) {
        grid.setChildData(evt1.filter.parentObject, evt.result.deals, evt1.filter.level.getParentLevel());
        //grid.setChildData(evt1.filter.parentObject, [], evt1.filter.level.getParentLevel());

      }
    );
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Partial Lazy Loaded</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid  width={"100%"}  ref={(grid) => { this.grid = grid; }} enablePrint enablePreferencePersistence enableExport enableCopy showSpinnerOnFilterPageSort preferencePersistenceKey="partialLazyLoaded"
                                      enableEagerDraw>
            <ReactDataGridColumnLevel enableFilters enablePaging pageSize={20} childrenField="deals" enableFooters selectedKeyField="id" itemLoadMode="server"
                                      itemLoad={this.columnlevel1_itemLoadHandler}>
              <ReactDataGridColumn type="checkbox" />
              <ReactDataGridColumn enableCellClickRowSelect={false} columnWidthMode="fitToContent" selectable dataField="id" headerText="ID" filterControl="TextInput" />
              <ReactDataGridColumn truncateToFit enableCellClickRowSelect={false} selectable dataField="legalName" headerText="Legal Name" width="150" columnWidthMode="fixed" />
              <ReactDataGridColumn dataField="headquarterAddress.line1" headerText="Address Line 1" footerLabel="Count:" footerOperation="count" />
              <ReactDataGridColumn dataField="headquarterAddress.line2" headerText="Address Line 2" />
              <ReactDataGridColumn dataField="headquarterAddress.city.name" headerText="City" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
              <ReactDataGridColumn dataField="headquarterAddress.state.name" headerText="State" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
              <ReactDataGridColumn dataField="headquarterAddress.country.name" headerText="Country" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
              <ReactDataGridColumn dataField="annualRevenue" headerText="Annual Revenue" columnWidthMode="fitToContent" textAlign="right" headerAlign="right" headerAlign="center" footerLabel="Avg:" footerOperation="average" footerAlign="center" columnWidthModeFitToContentExcludeHeader footerOperationPrecision={2}
                                    footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="numEmployees" headerText="Num Employees" columnWidthMode="fitToContent" columnWidthModeFitToContentExcludeHeader textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2}
                                    footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="earningsPerShare" headerText="EPS" columnWidthMode="fitToContent" columnWidthModeFitToContentExcludeHeader textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
                                    footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="lastStockPrice" headerText="Stock Price" columnWidthMode="fitToContent" columnWidthModeFitToContentExcludeHeader textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2}
                                    footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumnLevel childrenField="invoices" enableFooters selectedKeyField="id">
                      <ReactDataGridColumn type="checkbox" />
                      <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerLabel="Count:" footerOperation="count" footerAlign="center" />
                      <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum" footerAlign="right"
                                            footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                      <ReactDataGridColumn editable editorDataField="selectedDate" dataField="dealDate" headerText="Deal Date"
                                            labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                      <ReactDataGridColumnLevel childrenField="lineItems" enableFooters enablePaging pageSize={5} selectedKeyField="id" >
                              <ReactDataGridColumn type="checkbox" />
                              <ReactDataGridColumn editable dataField="id" headerText="Invoice Number" footerLabel="Count:" footerOperation="count" footerAlign="center" />
                              <ReactDataGridColumn editable dataField="invoiceAmount" headerText="Invoice Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum" footerAlign="right"
                                                    footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                              <ReactDataGridColumn editable dataField="invoiceStatus.name" headerText="Invoice Status" />
                              <ReactDataGridColumn editable editorDataField="selectedDate" dataField="invoiceDate" headerText="Invoice Date"
                                                    labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                              <ReactDataGridColumn editable editorDataField="selectedDate" dataField="dueDate" headerText="Due Date"
                                                    labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                              <ReactDataGridColumnLevel enableFooters selectedKeyField="id">
                                      <ReactDataGridColumn type="checkbox" />
                                      <ReactDataGridColumn editable dataField="lineItemDescription" headerText="Line Item Description" footerLabel="Count:" footerOperation="count" footerAlign="center" />
                                      <ReactDataGridColumn editable dataField="lineItemAmount" headerText="Line Item Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum" footerAlign="right"
                                                            footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
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

