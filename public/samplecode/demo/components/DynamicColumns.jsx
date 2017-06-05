import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants, ClassFactory, ComboBox, DatePicker } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

let dynamicColumnsCounter = 0;
let counter = 0;

export default class DynamicColumns extends React.Component {
  constructor() {
    super();
  }

  handleAddLastStockPriceColumn() {
    var grid = this.grid;
    var col = this.addCurrencyColumn("lastStockPrice", "Last Stock Price")
    grid.addColumn(col);
    grid.distributeColumnWidthsEqually();
    grid.reDraw();
  }

  handleRemoveLastStockPriceColumn() {
    var grid = this.grid;
    grid.removeColumn(grid.getColumnByDataField("lastStockPrice"));
    grid.distributeColumnWidthsEqually();
    grid.reDraw();
  }

  componentDidMount() {

    var grid = this.grid;
    grid.setDataProvider(FlexiciousMockGenerator.instance().getFlatOrgList());;
    grid.clearColumns();

    var col = this.addColumn("id", "Company ID");
    col.setColumnLockMode(flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT)
    grid.addColumn(col);
    col = this.addColumn("legalName", "Company Name");
    col.setColumnLockMode(flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_RIGHT)
    grid.addColumn(col);
    grid.addColumn(this.addColumn("headquarterAddress.line1", "Address Line 1"));
    grid.addColumn(this.addColumn("headquarterAddress.line2", "Address Line2"));
    grid.addColumn(this.addCurrencyColumn("earningsPerShare", "EPS"));
    grid.addColumn(this.addColumn("headquarterAddress.line1", "Address Line 1"));
    grid.addColumn(this.addColumn("headquarterAddress.line2", "Address Line2"));
    grid.addColumn(this.addCurrencyColumn("earningsPerShare", "EPS"));
    grid.addColumn(this.addColumn("headquarterAddress.line1", "Address Line 1"));
    grid.addColumn(this.addColumn("headquarterAddress.line2", "Address Line2"));
    grid.addColumn(this.addCurrencyColumn("earningsPerShare", "EPS"));
    grid.addColumn(this.addColumn("headquarterAddress.line1", "Address Line 1"));
    grid.addColumn(this.addColumn("headquarterAddress.line2", "Address Line2"));
    grid.addColumn(this.addCurrencyColumn("earningsPerShare", "EPS"));
    //grid.distributeColumnWidthsEqually();
    grid.reDraw();
  };
  addCurrencyColumn(dataField, headerText) {
    var dgCol = this.addColumn(dataField, headerText);
    dgCol.setLabelFunction(UIUtils.dataGridFormatCurrencyLabelFunction);
    dgCol.setStyle("textAlign", "right");
    dgCol.setUniqueIdentifier(headerText + dynamicColumnsCounter++);
    dgCol.footerOperation = "average";
    dgCol.footerLabel = "Avg: ";
    dgCol.footerAlign = "right";
    dgCol.setStyle("paddingRight", 15);
    dgCol.filterOperation = "GreaterThan";
    dgCol.filterWaterMark = "Greater Than";
    return dgCol;
  }
  addColumn(dataField, headerText) {
    var grid = this.grid;
    var dgCol = grid.createColumn();
    dgCol.setDataField(dataField);
    dgCol.setHeaderText(headerText);
    //because columns are having the same header text, we need to provide unique identifiers.
    dgCol.setUniqueIdentifier(headerText + "" + counter++);
    dgCol.filterControl = "TextInput";
    dgCol.filterOperation = "BeginsWith";
    dgCol.filterWaterMark = "Begins With";
    return dgCol;
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Dynamic Columns</h1>
        <FullWidthSection useContent={true}>

          <RaisedButton onClick={this.handleAddLastStockPriceColumn.bind(this)} label={"Add Last Stock Price Column"} />
          <RaisedButton onClick={this.handleRemoveLastStockPriceColumn.bind(this)} label={"Remove Last Stock Price Column"} />
          <ReactDataGrid ref={(grid) => { this.grid = grid; }} horizontalScrollPolicy="on" ref={(grid) => { this.grid = grid; }} width={"100%"} height={500}
            enablePrint enablePreferencePersistence generateColumns={false} enableExport
            enableCopy enableFilters enableFooters enablePaging preferencePersistenceKey="dynamicColumns"
            />
        </FullWidthSection >
      </div >
    );
  }
}


