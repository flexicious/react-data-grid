import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, DatePicker, Filter } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import BusinessService from '../mockdata/BusinessService'
import PagedResult from '../mockdata/PagedResult'
let _footerData = {};

export default class FullLazyLoad extends React.Component {
  componentDidMount() {
    _footerData = {};
    const grid = this.refs.grid;
    var f = new Filter();
    f.pageIndex = 0;
    f.pageSize = grid.getPageSize();
    BusinessService.getInstance().getPagedOrganizationList(f,
      function (evt) {
        grid.setPreservePager(true);
        grid.setDataProvider(evt.result.collection);
        grid.setTotalRecords(evt.result.totalRecords);
      }
    );
  }

  /**
   *
   * @param cell
   * @return {String}
   */
  getFooterLabel(cell) {

    if (_footerData[cell.getRowInfo().getData()]) {
      if (cell.getColumn().dataField == "invoiceAmount" || cell.getColumn().dataField == "lineItemAmount" || cell.getColumn().dataField == "dealAmount")
        return "Total: " + UIUtils.formatCurrency(_footerData[cell.getRowInfo().getData()].total);
      else
        return "Count: " + _footerData[cell.getRowInfo().getData()].count;
    }
    return "";

  };
  printExportDataRequestHandler(evt) {
    const grid = evt1.currentTarget;
    //this means that we requested either all rows or a specific subset of rows....
    BusinessService.getInstance().getPagedOrganizationList(evt1.filter,
      function (evt, token) {
        grid.setPrintExportData(evt.result.collection);
      }
    );
  };

  level1_itemLoadHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means we were requested to load all the details for a specific organization.
    var org = evt1.filter.parentObject;
    org = org.clone();
    BusinessService.getInstance().getDealsForOrganization(org.id, evt1.filter,
      function (evt, token) {
        _footerData[org] = evt.result.summaryData;
        grid.setChildData(evt1.filter.parentObject, evt.result.collection, evt1.filter.level.getParentLevel(), evt.result.totalRecords)
      }
    );

  };

  level3_itemLoadHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means we were requested to load all the line items for a specific invoice.
    var inv = evt1.filter.parentObject;
    BusinessService.getInstance().getLineItemsForInvoice(inv.id, evt1.filter,
      function (evt, token) {
        _footerData[evt1.filter.parentObject] = evt.result.summaryData;
        grid.setChildData(evt1.filter.parentObject, (evt.result.collection.slice()), evt1.filter.level.getParentLevel(), evt.result.totalRecords)

      }
    );

  }

  level1_filterPageSortChangeHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means that we paged, sorted or filtered the list of top level organization.
    BusinessService.getInstance().getPagedOrganizationList(evt1.filter,
      function (evt, token) {
        grid.setPreservePager(true);
        grid.setDataProvider(evt.result.collection);
        grid.setTotalRecords(evt.result.totalRecords);
      }
    );

  };
  level2_filterPageSortChangeHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means that we paged, sorted or filtered the list of deals for an organization.

    var org = evt1.filter.parentObject;
    BusinessService.getInstance().getDealsForOrganization(org.id, evt1.filter,
      function (evt, token) {
        grid.setChildData(evt1.filter.parentObject, evt.result.collection, evt1.filter.level.getParentLevel(), evt.result.totalRecords);
      }
    );

  };

  level3_filterPageSortChangeHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means that we paged, sorted or filtered the list of invoices for a deal.

    var deal = evt1.filter.parentObject;
    BusinessService.getInstance().getInvoicesForDeal(deal.id, evt1.filter,
      function (evt, token) {
        grid.setChildData(evt1.filter.parentObject, new flexiciousNmsp.Array(evt.result.collection.slice()),
          evt1.filter.level.getParentLevel(), evt.result.totalRecords);
      }
    );

  };

  level4_filterPageSortChangeHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means that we paged, sorted or filtered the list of line items for an invoicef.

    var inv = evt1.filter.parentObject;
    BusinessService.getInstance().getLineItemsForInvoice(inv.id, evt1.filter,
      function (evt, token) {
        grid.setChildData(evt1.filter.parentObject, new flexiciousNmsp.Array(evt.result.collection.slice()), evt.filter.getLevel().getParentLevel(), evt.result.totalRecords);
      }
    );

  };
  level2_itemLoadHandler(evt1) {
    const grid = evt1.currentTarget.grid;

    //this means we were requested to load all the invoices for a specific deal.
    var deal = evt1.filter.parentObject;
    BusinessService.getInstance().getInvoicesForDeal(deal.id, evt1.filter,
      function (evt, token) {
        _footerData[evt1.filter.parentObject] = evt.result.summaryData;
        grid.setChildData(evt1.filter.parentObject, (evt.result.collection.slice()),
          evt1.filter.level.getParentLevel(), evt.result.totalRecords)

      }
    );

  };

  render() {
    return (
      <div>
        <h1 className='page-title'>Fully Lazy Loaded</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid width={"100%"} ref="grid" ref="grid" enablePrint horizontalScrollPolicy="auto" enableSelectAllOnPageChange={false}
            enableMaintainSelectionOnSelectAll clearSelectionOnDataProviderChange={false} enablePreferencePersistence enableExport enableCopy
            preferencePersistenceKey="fullyLazyLoaded"
            printExportDataRequest={this.printExportDataRequestHandler} showSpinnerOnFilterPageSort
            enableSelectionCascade enableSelectionBubble enableTriStateCheckbox enableEagerDraw >
            <ReactDataGridColumnLevel enableFilters enablePaging pageSize={10} childrenField="deals" enableFooters selectedKeyField="id" itemLoadMode="server"
              itemLoad={this.level1_itemLoadHandler}
              filterPageSortChange={this.level1_filterPageSortChangeHandler} filterPageSortMode="server">
              <ReactDataGridColumn type="checkbox" />
              <ReactDataGridColumn enableCellClickRowSelect={false} width="150" columnWidthMode="fixed" selectable dataField="id" headerText="ID" filterControl="TextInput" filterTriggerEvent="enterKeyUp" />
              <ReactDataGridColumn enableCellClickRowSelect={false} width="2000" excludeFromSettings excludeFromExport excludeFromPrint />
              <ReactDataGridColumnLevel childrenField="invoices" enableFooters selectedKeyField="id" itemLoadMode="server" itemLoad={this.level2_itemLoadHandler}
                enablePaging pageSize={3} filterPageSortMode="server" filterPageSortChange={this.level2_filterPageSortChangeHandler}>
                <ReactDataGridColumn type="checkbox" />
                <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerAlign="center" footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="dealDate" headerText="Deal Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerAlign="center" footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="dealDate" headerText="Deal Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerAlign="center" footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="dealDate" headerText="Deal Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerAlign="center" footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="dealDate" headerText="Deal Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumn editable dataField="dealDescription" headerText="Deal Description" footerAlign="center" footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn editable dataField="dealAmount" headerText="Deal Amount" textAlign="right" headerAlign="right" footerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} footerLabelFunction2={this.getFooterLabel} />
                <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="dealDate" headerText="Deal Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                <ReactDataGridColumnLevel childrenField="lineItems" enableFooters enablePaging pageSize={3} selectedKeyField="id" itemLoadMode="server" itemLoad={this.level3_itemLoadHandler} filterPageSortMode="server"
                  filterPageSortChange={this.level3_filterPageSortChangeHandler}>
                  <ReactDataGridColumn type="checkbox" />
                  <ReactDataGridColumn editable dataField="id" headerText="Invoice Number" footerLabelFunction2={this.getFooterLabel} footerAlign="center" />
                  <ReactDataGridColumn editable dataField="invoiceAmount" headerText="Invoice Amount" textAlign="right" headerAlign="right" footerAlign="right" footerLabelFunction2={this.getFooterLabel} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                  <ReactDataGridColumn editable dataField="invoiceStatus.name" headerText="Invoice Status" />
                  <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="invoiceDate" headerText="Invoice Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                  <ReactDataGridColumn itemEditor={flexiciousNmsp.DatePicker} editable editorDataField="selectedDate" dataField="dueDate" headerText="Due Date" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                  <ReactDataGridColumnLevel enableFooters selectedKeyField="id" enablePaging pageSize={3} filterPageSortMode="server" filterPageSortChange={this.level4_filterPageSortChangeHandler}>
                    <ReactDataGridColumn type="checkbox" />
                    <ReactDataGridColumn editable dataField="lineItemDescription" headerText="Line Item Description" footerLabelFunction2={this.getFooterLabel} footerAlign="center" />
                    <ReactDataGridColumn editable dataField="lineItemAmount" headerText="Line Item Amount" textAlign="right" headerAlign="right" footerLabelFunction2={this.getFooterLabel} footerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
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


