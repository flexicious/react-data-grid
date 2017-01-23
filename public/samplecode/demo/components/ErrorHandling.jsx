import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class ErrorHandling extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.refs.grid;
    grid.setDataProvider(FlexiciousMockGenerator.instance().getFlatOrgList());
  }
  
  itemEditCancel(evt){
    const grid = evt.currentTarget;
    grid.clearErrorByObject(evt.cell.getRowInfo().getData())
  };

  validate(editor){

    const grid = this.refs.grid;
    var cell=grid.getCurrentEditCell();
    var txt= editor;
    if(txt.getValue().length<3){
        grid.setErrorByObject(cell.getRowInfo().getData(),cell.getColumn().getDataField(),"Legal name must be greater than 3 characters");
    }else{
        grid.clearErrorByObject(cell.getRowInfo().getData());
    }

  //If you return true, the grid will highlight the error in red and move on to the next row.
  //If you return false, the edit box would stay in place and not let the user move forward
  //unless the error is corrected.

    return (txt.getValue().length>=3);
  };


  render() {
    return (
      <div>
        <h1 className='page-title'>Error Handling</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid  width={"100%"} ref="grid" editable enableFooters horizontalScrollPolicy="off">
            <ReactDataGridColumnLevel selectedKeyField="id" onitemEditCancel={this.itemEditCancel}>
                <ReactDataGridColumn type="checkbox" id="cbCol" />
                <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" />
                <ReactDataGridColumn dataField="legalName" headerText="Legal Name" editable itemEditorValidatorFunction={this.validate.bind(this)} />
                <ReactDataGridColumn dataField="annualRevenue" headerText="Annual Revenue" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerAlign="center" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn dataField="numEmployees" headerText="Num Employees" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn dataField="earningsPerShare" headerText="EPS" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                <ReactDataGridColumn dataField="lastStockPrice" headerText="Stock Price" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
            </ReactDataGridColumnLevel>
          </ReactDataGrid>


        </FullWidthSection>
      </div>
    );
  }
}


