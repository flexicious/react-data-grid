import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, ReactDataGridColumnGroup } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

let listOfObjects = [];
let number = 1;
export default class SelectionModes extends React.Component {
  constructor() {
    super();
  }

  onSelectionModeChange(event, mode) {
    var grid = this.refs.grid;
    grid.clearSelection();
    grid.enableStickyControlKeySelection = true;
    grid.setSelectionMode(mode);
    var cbCol = grid.getColumns()[0];
    if (cbCol.radioButtonMode != (mode == ReactDataGrid.SELECTION_MODE_SINGLE_ROW)) {
      cbCol.radioButtonMode = (mode == ReactDataGrid.SELECTION_MODE_SINGLE_ROW);
      grid.reDraw();
    }
  }
  componentDidMount() {
    const grid = this.refs.grid;

  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Selection Modes</h1>
        <FullWidthSection useContent={true}>

          <RadioButtonGroup name="shipSpeed" defaultSelected="Multiple Row" onChange={this.onSelectionModeChange.bind(this)}
            style={{ display: 'flex' }}>
            <RadioButton style={{ width: 'auto' }}
              value={ReactDataGrid.SELECTION_MODE_SINGLE_CELL}
              label="Single Cell"
              />
            <RadioButton style={{ width: 'auto' }}
              value={ReactDataGrid.SELECTION_MODE_MULTIPLE_CELLS}
              label="Multiple Cells"
              />
            <RadioButton style={{ width: 'auto' }}
              value={ReactDataGrid.SELECTION_MODE_SINGLE_ROW}
              label="Single Row"
              />
            <RadioButton  style={{ width: 'auto' }}
              value={ReactDataGrid.SELECTION_MODE_MULTIPLE_ROWS}
              label="Multiple Rows"
              />
            <RadioButton style={{ width: 'auto' }}
              value={ReactDataGrid.SELECTION_MODE_NONE}
              label="None"
              />
          </RadioButtonGroup>

          <RaisedButton onClick={() => { this.refs.grid.clearSelection() } } label={"Clear Selection"} />
          <RaisedButton onClick={() => { alert('Selected Keys:' + this.refs.grid.getSelectedKeys().join('|')) } } label={"Show Selection"} />



          <ReactDataGrid  width={"100%"} ref="grid" enableFooters selectedKeyField="id" preferencePersistenceKey="selectionModes"
            dataProvider={FlexiciousMockGenerator.instance().getFlatOrgList()}>
            <ReactDataGridColumn type="checkbox" id="cbCol" />
            <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" />
            <ReactDataGridColumn dataField="legalName" headerText="Legal Name" />
            <ReactDataGridColumn dataField="headquarterAddress.line1" headerText="Address Line 1" footerLabel="Count:" footerOperation="count" />
            <ReactDataGridColumn dataField="headquarterAddress.line2" headerText="Address Line 2" />
            <ReactDataGridColumn dataField="headquarterAddress.city.name" headerText="City" />
            <ReactDataGridColumn dataField="headquarterAddress.state.name" headerText="State" />
            <ReactDataGridColumn dataField="headquarterAddress.country.name" headerText="Country" />
            <ReactDataGridColumn dataField="annualRevenue" headerText="Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center" footerLabel="Avg:" footerOperation="average" footerAlign="center" footerOperationPrecision={2}
              footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
            <ReactDataGridColumn dataField="numEmployees" headerText="Num Employees" textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
              footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
            <ReactDataGridColumn dataField="earningsPerShare" headerText="EPS" textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
              footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
            <ReactDataGridColumn dataField="lastStockPrice" headerText="Stock Price" textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
              footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
          </ReactDataGrid>
        </FullWidthSection>
      </div >
    );
  }
}


