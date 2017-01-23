import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

let arrColl;
export default class VariableHeaderRowHeight extends React.Component {
  constructor() {
    super();
    arrColl = [
    {label:"Company A", state:"NJ", rank:"1"},
    {label:"Company B", state:"PA", rank:"11"},
    {label:"Company C", state:"CT", rank:"111"},
    {label:"Company D", state:"NY", rank:"2"},
    {label:"Company E", state:"NJ", rank:"22"}];
  }

  componentDidMount() {
    const grid = this.refs.grid;
  }

  handleDoubleClick(event) {
    const grid = this.refs.grid;
    grid.setSelectedObjects([event.item]);
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Variable Header Row Height</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid  width={"100%"} ref="grid" selectionMode="singleRow" variableHeaderHeight variableRowHeight horizontalScrollPolicy="off" 
          variableRowHeightUseRendererForCalculation dataProvider={arrColl} selectedKeyField="label" doubleClickEnabled itemDoubleClick={this.handleDoubleClick.bind(this)}>
            <ReactDataGridColumnLevel>
                <ReactDataGridColumn type="checkbox" />
                <ReactDataGridColumn headerText="ZZZZZ ZZZZZ ZZZZZ ZZZZZ ZZZZ ZZZZ ZZZZZ ZZZZ ZZZZ ZZZZ ZZZZ 11111" headerWordWrap dataField="label" columnWidthMode={"percent"} percentWidth={25}/>
                <ReactDataGridColumn headerText="ZZZZZ ZZZZZ ZZZZZ ZZZZZ ZZZZ ZZZZ ZZZZZ ZZZZ ZZZZ ZZZZ ZZZZ 22222" headerWordWrap dataField="label" columnWidthMode={"percent"} percentWidth={25}/>
                <ReactDataGridColumn headerText="ZZZZZ ZZZZZ ZZZZZ ZZZZZ ZZZZ ZZZZ ZZZZZ ZZZZ ZZZZ ZZZZ ZZZZ 33333" headerWordWrap dataField="rank" columnWidthMode={"percent"} percentWidth={25}/>
                <ReactDataGridColumn headerText="ZZZZZ ZZZZZ ZZZZZ ZZZZZ ZZZZ ZZZZ ZZZZZ ZZZZ ZZZZ ZZZZ ZZZZ 44444" headerWordWrap columnWidthMode={"percent"} percentWidth={25}/>
                <ReactDataGridColumn headerText="ZZZZZ ZZZZZ ZZZZZ ZZZZZ ZZZZ ZZZZ ZZZZZ ZZZZ ZZZZ ZZZZ ZZZZ 55555" headerWordWrap columnWidthMode={"fixed"} width={125}/>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


