import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'


import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

let ArrCol = [];

export default class FilterComboBoxDataProvider extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.refs.grid;
    ArrCol = [
    {label:"Aflac", state:"NJ", startDate:new Date()},
    {label:"Ambac", state:"PA", startDate:new Date()},
    {label:"BestBuy", state:"CT", startDate:new Date()},
    {label:"Berkshire", state:"NY", startDate:new Date()},
    {label:"BP", state:"NJ", startDate:new Date()}];
    grid.setDataProvider(ArrCol);
    this.filterPageSortChangeHandler=this.filterPageSortChangeHandler.bind(this);
    this.loadFilters();
  }

   
  loadFilters(){
    const grid = this.refs.grid;
    var filteredArray = flexiciousNmsp.UIUtils.filterArray(ArrCol,grid.createFilter(),grid,grid.getColumnLevel(),false)
    var stateCol= grid.getColumnByDataField("state");
    stateCol.filterComboBoxDataProvider = (stateCol.getDistinctValues(filteredArray));
    grid.rebuildFilter();
  };

  filterPageSortChangeHandler(evt){
    this.delegate.loadFilters();
  };

  render() {
    return (
      <div>
        <h1 className='page-title'>Filter ComboBox Data Provider</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid delegate={this}  width={"100%"} ref="grid" enableFilters preferencePersistenceKey="filterComboboxDataprovider"
            onfilterPageSortChange={this.filterPageSortChangeHandler} enableExport	forcePagerRow enablePaging >  
            <ReactDataGridColumnLevel>
                <ReactDataGridColumn dataField="label" filterControl="TextInput" filterOperation="BeginsWith" />
                <ReactDataGridColumn dataField="state" id="stateCol" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid={false} />
                <ReactDataGridColumn dataField="startDate" format="date" filterControl="DateComboBox" />
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


