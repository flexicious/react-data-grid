import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'

import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

let arrColl;
export default class MultiSelectSetFilterValue extends React.Component {
  constructor() {
    super();
    arrColl = [
    {label:"Aflac", state:"NJ"},
    {label:"Ambac", state:"PA"},
    {label:"BestBuy", state:"CT"},
    {label:"Berkshire", state:"NY"},
    {label:"BP", state:"NJ"},
    {label:"Company without state 1", state:""},
    {label:"Company without state 2", state:""}];
  }

  componentDidMount() {
    const grid = this.grid;
  }

  handlesetFilterValue() {
      const grid = this.grid;
      var arr = new Array();
      arr.push("NY");
      arr.push("CT");
      grid.setFilterValue("state",arr);
  };

  render() {
    return (
      <div>
        <h1 className='page-title'>MultiSelect Set Filter Value</h1>
        <RaisedButton onClick={this.handlesetFilterValue.bind(this)} label={"Set Filter Value"} />
        <FullWidthSection useContent={true}>
          <ReactDataGrid  width={"100%"} dataProvider={arrColl} ref={(grid) => { this.grid = grid; }} enableFilters >
              <ReactDataGridColumn dataField="label" filterControl="TextInput" filterOperation="BeginsWith" />
              <ReactDataGridColumn dataField="state" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid />
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


