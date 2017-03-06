import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, DatePicker, Filter} from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import BusinessService from '../mockdata/BusinessService'

export default class LevelRenderer extends React.Component {
  componentDidMount() {
    this.refs.grid.validateNow();
    this.refs.grid.expandAll();
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Level Renderers</h1>
        <FullWidthSection useContent={true}>


          <ReactDataGrid ref="grid"  width={"100%"} enablePrint enablePreferencePersistence enableDrillDown enableExport enableCopy preferencePersistenceKey="levelRenderers"
            dataProvider={FlexiciousMockGenerator.instance().getDeepOrgListSync()} horizontalScrollPolicy="off" >
            <ReactDataGridColumnLevel enableFilters enablePaging pageSize={20} childrenField="deals" enableFooters selectedKeyField="id" >
              <ReactDataGridColumn type="checkbox" />
              <ReactDataGridColumn enableCellClickRowSelect={false} columnWidthMode="fitToContent" selectable dataField="id" headerText="ID" filterControl="TextInput" />
              <ReactDataGridColumn truncateToFit enableCellClickRowSelect={false} selectable dataField="legalName" headerText="Legal Name" width="150" columnWidthMode="fixed" />
              <ReactDataGridColumn dataField="headquarterAddress.line1" headerText="Address Line 1" footerLabel="Count:" footerOperation="count" />
              <ReactDataGridColumn dataField="headquarterAddress.line2" headerText="Address Line 2" />
              <ReactDataGridColumn dataField="headquarterAddress.city.name" headerText="City" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid />
              <ReactDataGridColumn dataField="headquarterAddress.state.name" headerText="State" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid />
              <ReactDataGridColumn dataField="headquarterAddress.country.name" headerText="Country" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid />
              <ReactDataGridColumn dataField="annualRevenue" headerText="Annual Revenue" columnWidthMode="fitToContent" textAlign="right" headerAlign="right" headerAlign="center" footerLabel="Avg:"
                footerOperation="average" footerAlign="center" columnWidthModeFitToContentExcludeHeader footerOperationPrecision={2}
                footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="numEmployees" headerText="Num Employees" columnWidthMode="fitToContent" columnWidthModeFitToContentExcludeHeader textAlign="right" headerAlign="right"
                footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="earningsPerShare" headerText="EPS" columnWidthMode="fitToContent" columnWidthModeFitToContentExcludeHeader textAlign="right" headerAlign="right" footerLabel="Avg:"
                footerOperation="average" footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="lastStockPrice" headerText="Stock Price" columnWidthMode="fitToContent" columnWidthModeFitToContentExcludeHeader textAlign="right" headerAlign="right"
                footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumnLevel childrenField="invoices" enableFooters selectedKeyField="id">
                <ReactDataGridColumn type="checkbox" />
                <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerLabel="Count:" footerOperation="count" footerAlign="center" />
                <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum"
                  footerAlign="right" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn dataField="dealDate" headerText="Deal Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumnLevel childrenField="lineItems" enableFooters enablePaging pageSize={5} selectedKeyField="id"
                  nextLevelRenderer={NextLevelRenderer} levelRendererHeight="150">
                  <ReactDataGridColumn type="checkbox" />
                  <ReactDataGridColumn editable dataField="id" headerText="Invoice Number" footerLabel="Count:" footerOperation="count" footerAlign="center" />
                  <ReactDataGridColumn editable dataField="invoiceAmount" headerText="Invoice Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum" footerAlign="right" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                  <ReactDataGridColumn editable dataField="invoiceStatus.name" headerText="Invoice Status" />
                  <ReactDataGridColumn dataField="invoiceDate" headerText="Invoice Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                </ReactDataGridColumnLevel>
              </ReactDataGridColumnLevel>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}



const NextLevelRenderer = ({cell, row, column, level, grid}) => {
  const blackBorder = { border: "solid 1px #cccccc" };
  const val = row.getData();
  return <fieldset><legend>Invoice Information</legend><table style={{ width: "100%" }}><tbody><tr>
    <td style={blackBorder}>Invoice Number {val.id}</td>
    <td style={blackBorder}>Invoice Date {UIUtils.formatDate(val.invoiceDate)} </td>
    <td style={blackBorder}>Due Date: {UIUtils.formatDate(val.dueDate)} </td>
  </tr><tr>
      <td style={blackBorder}>Deal Amount:{UIUtils.formatCurrency(val.deal.getDealAmount())}</td>
      <td style={blackBorder}>Deal Description: {val.deal.dealDescription}</td>
      <td style={blackBorder}>Deal Status: {val.deal.dealStatus.name}</td>
    </tr><tr>
      <td style={blackBorder}>Client Name:{val.deal.customer.legalName}</td>
      <td colSpan={2} style={blackBorder}>Address: {val.deal.customer.headquarterAddress.toDisplayString()}</td>
    </tr></tbody></table></fieldset>;
}