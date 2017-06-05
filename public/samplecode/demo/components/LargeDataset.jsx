import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator'
import BusinessService from '../mockdata/BusinessService'

export default class LargeDataset extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    const grid = this.grid;
    BusinessService.getInstance().getAllLineItems(function (evt, token) { 
      grid.setDataProvider(evt.result) 
    })
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Large Dataset</h1>
        <FullWidthSection useContent={true}>


          <ReactDataGrid width={"100%"} rowHeight={25} ref={(grid) => { this.grid = grid; }} horizontalScrollPolicy="on" preferencePersistenceKey="largeDataset" 
            >
            <ReactDataGridColumn dataField="index" headerText="Index" sortNumeric />
            <ReactDataGridColumn dataField="id" headerText="1 ID" sortNumeric />
            <ReactDataGridColumn dataField="lineItemDescription" headerText="2 Line Item Description" width={200} />
            <ReactDataGridColumn dataField="lineItemAmount" headerText="3 Line Item Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceNumber" headerText="4 Invoice Number" />
            <ReactDataGridColumn dataField="invoice.invoiceAmount" headerText="5 Invoice Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceStatus.name" headerText="6 Invoice Status" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="7 Deal" />
            <ReactDataGridColumn dataField="invoice.invoiceDate" headerText="8 Invoice Date" />
            <ReactDataGridColumn dataField="invoice.dueDate" headerText="9 Due Date" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="10 Deal" width={200} />
            <ReactDataGridColumn dataField="invoice.deal.dealStatus.name" headerText="11 Deal Status" />
            <ReactDataGridColumn dataField="invoice.deal.customer.legalName" headerText="12 Customer" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line1" headerText="13 Address Line 1" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line2" headerText="14 Address Line 2" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.city.name" headerText="15 City" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.state.name" headerText="16 State" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.country.name" headerText="17 Country" />
            <ReactDataGridColumn dataField="invoice.deal.customer.annualRevenue" headerText="18 Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center" />
            <ReactDataGridColumn dataField="invoice.deal.customer.numEmployees" headerText="19 Num Employees" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.earningsPerShare" headerText="20 EPS" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.lastStockPrice" headerText="21 Stock Price" />
            <ReactDataGridColumn dataField="id" headerText="22 ID" />
            <ReactDataGridColumn dataField="lineItemDescription" headerText="23 Line Item Description" width={200} />
            <ReactDataGridColumn dataField="lineItemAmount" headerText="24 Line Item Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceNumber" headerText="25 Invoice Number" />
            <ReactDataGridColumn dataField="invoice.invoiceAmount" headerText="26 Invoice Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceStatus.name" headerText="27 Invoice Status" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="28 Deal" />
            <ReactDataGridColumn dataField="invoice.invoiceDate" headerText="29 Invoice Date" />
            <ReactDataGridColumn dataField="invoice.dueDate" headerText="30 Due Date" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="31 Deal" width={200} />
            <ReactDataGridColumn dataField="invoice.deal.dealStatus.name" headerText="32 Deal Status" />
            <ReactDataGridColumn dataField="invoice.deal.customer.legalName" headerText="33 Customer" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line1" headerText="34 Address Line 1" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line2" headerText="35 Address Line 2" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.city.name" headerText="36 City" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.state.name" headerText="37 State" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.country.name" headerText="38 Country" />
            <ReactDataGridColumn dataField="invoice.deal.customer.annualRevenue" headerText="39 Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center" />
            <ReactDataGridColumn dataField="invoice.deal.customer.numEmployees" headerText="40 Num Employees" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.earningsPerShare" headerText="41 EPS" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.lastStockPrice" headerText="42 Stock Price" />
            <ReactDataGridColumn dataField="id" headerText="43 ID" />
            <ReactDataGridColumn dataField="lineItemDescription" headerText="44 Line Item Description" width={200} />
            <ReactDataGridColumn dataField="lineItemAmount" headerText="45 Line Item Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceNumber" headerText="46 Invoice Number" />
            <ReactDataGridColumn dataField="invoice.invoiceAmount" headerText="47 Invoice Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceStatus.name" headerText="48 Invoice Status" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="49 Deal" />
            <ReactDataGridColumn dataField="invoice.invoiceDate" headerText="50 Invoice Date" />
            <ReactDataGridColumn dataField="invoice.dueDate" headerText="51 Due Date" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="52 Deal" width={200} />
            <ReactDataGridColumn dataField="invoice.deal.dealStatus.name" headerText="53 Deal Status" />
            <ReactDataGridColumn dataField="invoice.deal.customer.legalName" headerText="54 Customer" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line1" headerText="55 Address Line 1" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line2" headerText="56 Address Line 2" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.city.name" headerText="57 City" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.state.name" headerText="58 State" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.country.name" headerText="59 Country" />
            <ReactDataGridColumn dataField="invoice.deal.customer.annualRevenue" headerText="60 Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center" />
            <ReactDataGridColumn dataField="invoice.deal.customer.numEmployees" headerText="61 Num Employees" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.earningsPerShare" headerText="62 EPS" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.lastStockPrice" headerText="63 Stock Price" />
            <ReactDataGridColumn dataField="id" headerText="64 ID" />
            <ReactDataGridColumn dataField="lineItemDescription" headerText="65 Line Item Description" width={200} />
            <ReactDataGridColumn dataField="lineItemAmount" headerText="66 Line Item Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceNumber" headerText="67 Invoice Number" />
            <ReactDataGridColumn dataField="invoice.invoiceAmount" headerText="68 Invoice Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceStatus.name" headerText="69 Invoice Status" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="70 Deal" />
            <ReactDataGridColumn dataField="invoice.invoiceDate" headerText="71 Invoice Date" />
            <ReactDataGridColumn dataField="invoice.dueDate" headerText="72 Due Date" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="73 Deal" width={200} />
            <ReactDataGridColumn dataField="invoice.deal.dealStatus.name" headerText="74 Deal Status" />
            <ReactDataGridColumn dataField="invoice.deal.customer.legalName" headerText="75 Customer" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line1" headerText="76 Address Line 1" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line2" headerText="77 Address Line 2" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.city.name" headerText="78 City" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.state.name" headerText="79 State" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.country.name" headerText="80 Country" />
            <ReactDataGridColumn dataField="invoice.deal.customer.annualRevenue" headerText="81 Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center" />
            <ReactDataGridColumn dataField="invoice.deal.customer.numEmployees" headerText="82 Num Employees" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.earningsPerShare" headerText="83 EPS" textAlign="right" headerAlign="right" />
            <ReactDataGridColumn dataField="invoice.deal.customer.lastStockPrice" headerText="84 Stock Price" />
            <ReactDataGridColumn dataField="id" headerText="85 ID" />
            <ReactDataGridColumn dataField="lineItemDescription" headerText="86 Line Item Description" width={200} />
            <ReactDataGridColumn dataField="lineItemAmount" headerText="87 Line Item Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceNumber" headerText="88 Invoice Number" />
            <ReactDataGridColumn dataField="invoice.invoiceAmount" headerText="89 Invoice Amount" />
            <ReactDataGridColumn dataField="invoice.invoiceStatus.name" headerText="90 Invoice Status" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="91 Deal" />
            <ReactDataGridColumn dataField="invoice.invoiceDate" headerText="92 Invoice Date" />
            <ReactDataGridColumn dataField="invoice.dueDate" headerText="93 Due Date" />
            <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="94 Deal" width={200} />
            <ReactDataGridColumn dataField="invoice.deal.dealStatus.name" headerText="95 Deal Status" />
            <ReactDataGridColumn dataField="invoice.deal.customer.legalName" headerText="96 Customer" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line1" headerText="97 Address Line 1" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.line2" headerText="98 Address Line 2" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.city.name" headerText="99 City" />
            <ReactDataGridColumn dataField="invoice.deal.customer.headquarterAddress.state.name" headerText="100 State" />
          </ReactDataGrid>



        </FullWidthSection >
      </div >
    );
  }
}


