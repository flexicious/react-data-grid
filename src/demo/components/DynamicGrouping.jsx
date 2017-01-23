import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants, ClassFactory, ComboBox, DatePicker } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

export default class DynamicGrouping extends React.Component {
  constructor() {
    super();
    this.handleGroupClick=this.handleGroupClick.bind(this);
  }

  componentDidMount() {
    const grid = this.refs.grid;
    grid.setDataProvider(FlexiciousMockGenerator.instance().getAllLineItems());
    this.groupBy("invoice.id");
  }

  handleGroupClick(event, intex, newValue) {
    this.groupBy(newValue);
  };

  groupBy(prop) {
    const grid = this.refs.grid;
    var buckets = {};
    var key;
    var result = [];
    var _dataProvider = new Object();
    var _flat = FlexiciousMockGenerator.instance().getAllLineItems();
    //iterate through the flat list and create a hierarchy
    for(var i=0;i<_flat.length;i++){
        var item =_flat[i];
        key = flexiciousNmsp.UIUtils.resolveExpression(item,prop); //the parent
        if(!buckets[key]){
            buckets[key] = [];//the children
        }
        buckets[key].push(item); //add to the parents child list
    }
    for (key  in buckets){
        result.push({name:key,children:buckets[key]}); //create the final structure
    }
    _dataProvider = result; //this will refresh the grid...
    grid.setDataProvider(_dataProvider);
    grid.rebuild();
  };


  render() {
    return (
      <div>
        <h1 className='page-title'>Dynamic Grouping</h1>
        
        <FullWidthSection useContent={true} >
          <SelectField floatingLabelText="SelectGroup" ref="groupingField" onChange={this.handleGroupClick}>
             <MenuItem value="invoice.id" primaryText="Invoice Number" />
              <MenuItem value="invoice.invoiceStatus.name" primaryText="Invoice Status" />
              <MenuItem value="invoice.deal.dealDescription" primaryText="Deal" />
              <MenuItem value="invoice.deal.dealStatus.name" primaryText="Deal Status" />
              <MenuItem value="invoice.deal.customer.legalName" primaryText="Customer" />
              <MenuItem value="invoice.deal.customer.headquarterAddress.city.name" primaryText="City" />
              <MenuItem value="invoice.deal.customer.headquarterAddress.state.name" primaryText="State" />
              <MenuItem value="invoice.deal.customer.headquarterAddress.country.name" primaryText="Country" />
          </SelectField>
          <ReactDataGrid horizontalScrollPolicy="on" ref="grid" width={"100%"} height="600" enableDynamicLevels enableHeightAutoAdjust preferencePersistenceKey="dynamicGrouping" >
            <ReactDataGridColumnLevel childrenField="children" nestIndent={25}>
              <ReactDataGridColumn dataField="name" headerText="Name" columnLockMode="left" />
              <ReactDataGridColumn dataField="id" headerText="1 ID" />
              <ReactDataGridColumn dataField="lineItemDescription" headerText="2 Line Item Description" width="200" />
              <ReactDataGridColumn dataField="lineItemAmount" headerText="3 Line Item Amount" />
              <ReactDataGridColumn dataField="invoice.invoiceNumber" headerText="4 Invoice Number" />
              <ReactDataGridColumn dataField="invoice.invoiceAmount" headerText="5 Invoice Amount" />
              <ReactDataGridColumn dataField="invoice.invoiceStatus.name" headerText="6 Invoice Status" />
              <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="7 Deal" />
              <ReactDataGridColumn dataField="invoice.invoiceDate" headerText="8 Invoice Date" />
              <ReactDataGridColumn dataField="invoice.dueDate" headerText="9 Due Date" />
              <ReactDataGridColumn dataField="invoice.deal.dealDescription" headerText="10 Deal" width="200" />
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
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


