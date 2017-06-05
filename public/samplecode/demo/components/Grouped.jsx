import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'


export default class Grouped extends React.Component {
  constructor() {
    super();
    this.onCreationComplete = this.onCreationComplete.bind(this);
  }

  componentDidMount() {
    this.grid.validateNow();
    this.grid.expandAll();
  }
  onCreationComplete() {
    console.log('Grid initialized')
  }

  checkCellDisabled(cell) {
    return !(cell.rowInfo.getData().implementsOrExtends('Invoice'));
  }

  getInvoiceAmount(data, col) {
    var val = 0;
    if (data.implementsOrExtends('Invoice'))
      val = (data).getInvoiceAmount();
    else if (data.implementsOrExtends('Deal'))
      val = (data).getDealAmount();
    else if (data.implementsOrExtends('Organization'))
      val = (data).getRelationshipAmount();

    return UIUtils.formatCurrency(val);

  }

  amountSortCompareFunction(obj1, obj2) {
    if (obj1.implementsOrExtends('Organization') && obj2.implementsOrExtends('Organization')) {
      return UIUtils.numericCompare(obj1.getRelationshipAmount(), obj2.getRelationshipAmount());
    }
    else if (obj1.implementsOrExtends('Deal') && obj2.implementsOrExtends('Deal')) {
      return UIUtils.numericCompare(obj1.getDealAmount(), obj2.getDealAmount());
    }
    else if (obj1.implementsOrExtends('Invoice') && obj2.implementsOrExtends('Invoice')) {
      return UIUtils.numericCompare(obj1.getInvoiceAmount(), obj2.getInvoiceAmount());
    }
    return 0;


  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Grouped Data</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid width={"100%"} dataProvider={FlexiciousMockGenerator.instance().getDeepOrgListSync()} horizontalScrollPolicy="off"
            ref={(grid) => { this.grid = grid; }} ref={(grid) => { this.grid = grid; }} enablePrint horizontalGridLines enablePreferencePersistence enableFilters enableExport enableCopy
            enableEagerDraw showSpinnerOnFilterPageSort preferencePersistenceKey="groupedData" oncreationComplete={this.onCreationComplete}
            enableMultiColumnSort enableSelectionCascade>
            <ReactDataGridColumnLevel enableFilters enablePaging pageSize={20} childrenField="deals" selectedKeyField="id" reusePreviousLevelColumns >
              <ReactDataGridColumn type="checkbox" />
              <ReactDataGridColumn dataField="legalName" headerText="Organization Name" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn dataField="dealDescription" headerText="Deal Description" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn dataField="id" headerText="Invoice Number" footerLabel="Count:" footerOperation="count" footerAlign="center" filterControl="TextInput"
                filterOperation="BeginsWith" />
              <ReactDataGridColumn dataField="invoiceAmount" headerText="Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum" footerAlign="right"
                footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={this.getInvoiceAmount}
                sortCompareFunction={this.amountSortCompareFunction} />
              <ReactDataGridColumn dataField="invoiceStatus.name" headerText="Invoice Status" filterControl="MultiSelectComboBox"
                filterComboBoxDataProvider={SystemConstants.invoiceStatuses} enableRecursiveSearch filterComboBoxDataField="code"
                filterComboBoxLabelField="name" />
              <ReactDataGridColumn itemEditor="flexiciousNmsp.DatePicker" dataField="invoiceDate" headerText="Invoice Date"
                filterControl="DateComboBox" labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
              <ReactDataGridColumn itemEditor="flexiciousNmsp.DatePicker" dataField="dueDate" headerText="Due Date" filterControl="DateComboBox"
                labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
              <ReactDataGridColumnLevel childrenField="invoices" selectedKeyField="id" reusePreviousLevelColumns >
                <ReactDataGridColumnLevel enableFooters enablePaging pageSize={5} selectedKeyField="id" reusePreviousLevelColumns>
                </ReactDataGridColumnLevel>
              </ReactDataGridColumnLevel>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


