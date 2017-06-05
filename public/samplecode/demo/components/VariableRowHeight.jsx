import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SampleData from '../mockdata/SampleData.js'

export default class VariableRowHeight extends React.Component {
  constructor() {
    super();
    this.dataGridFormatDateLabelFunction = this.dataGridFormatDateLabelFunction.bind(this);
  }

  componentDidMount() {
    const grid = this.grid;
    grid.setDataProvider(SampleData.bookData);
    grid.validateNow();
    grid.expandAll();
  }

  convertDate(item,col) {
    var dt = flexiciousNmsp.UIUtils.resolveExpression(item,col.getDataField()).toString();
    var date =flexiciousNmsp.UIUtils.getDateValue(dt,flexiciousNmsp.Constants.YMD_MASK); //will need to change this for
    return date;
  }

  dataGridFormatDateLabelFunction(item, dgColumn) {
    var num=flexiciousNmsp.UIUtils.resolveExpression(item,dgColumn.dataField);
    var date=this.convertDate(item,dgColumn);
    return flexiciousNmsp.UIUtils.formatDate(date);
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Variable Row Height</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid  width={"100%"} ref={(grid) => { this.grid = grid; }} enablePrint enablePreferencePersistence enableExport enableCopy enableFilters enableFooters initialSortField="title" preferencePersistenceKey="variableRowHeight" initialSortAscending forcePagerRow variableRowHeight horizontalScrollPolicy="off">
              <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" filterOperation="Contains" columnWidthMode="fitToContent" />
              <ReactDataGridColumn dataField="title" headerText="Title" filterControl="TextInput" columnWidthMode="fitToContent" footerLabel="Count:" footerOperation="count" footerAlign="center" filterOperation="Contains" />
              <ReactDataGridColumn dataField="description" headerText="Description" wordWrap />
              <ReactDataGridColumn dataField="genre" headerText="Genre" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid columnWidthMode="fitToContent" />
              <ReactDataGridColumn dataField="price" headerText="Price" filterControl="NumericRangeBox" columnWidthMode="fixed" width="100" footerLabel="Avg:" footerOperation="average" footerAlign="center" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn dataField="publish_date" headerText="Publish Date" filterControl="DateComboBox" columnWidthMode="fitToContent" filterConverterFunction={this.convertDate} labelFunction={this.dataGridFormatDateLabelFunction} />
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


