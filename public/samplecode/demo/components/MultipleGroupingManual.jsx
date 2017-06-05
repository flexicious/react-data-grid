import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'

import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

let dpFlat;
export default class MultipleGroupingManual extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.grid;
    dpFlat = [
    {Region:"Southwest", RegionCode:"SW", Territory:"Arizona",TerritoryCode:"AZ",
        Territory_Rep:"Barbara Jennings", Actual:38865, Estimate:40000},
    {Region:"Southwest", RegionCode:"SW", Territory:"Arizona",TerritoryCode:"AZ",
        Territory_Rep:"Dana Binn", Actual:29885, Estimate:30000},
    {Region:"Southwest", RegionCode:"SW", Territory:"Central California",TerritoryCode:"CA",
        Territory_Rep:"Joe Smith", Actual:29134, Estimate:30000},
    {Region:"Southwest",RegionCode:"SW",  Territory:"Nevada",TerritoryCode:"NV",
        Territory_Rep:"Bethany Pittman", Actual:52888, Estimate:45000},
    {Region:"Southwest",RegionCode:"SW",  Territory:"Northern California",TerritoryCode:"NC",
        Territory_Rep:"Lauren Ipsum", Actual:38805, Estimate:40000},
    {Region:"Southwest", RegionCode:"SW", Territory:"Northern California",TerritoryCode:"NC",
        Territory_Rep:"T.R. Smith", Actual:55498, Estimate:40000},
    {Region:"Southwest", RegionCode:"SW",Territory:"Southern California",TerritoryCode:"SC",
        Territory_Rep:"Alice Treu", Actual:44985, Estimate:45000},
    {Region:"Southwest", RegionCode:"SW" ,Territory:"Southern California",TerritoryCode:"SC",
        Territory_Rep:"Jane Grove", Actual:44913, Estimate:45000},
    {Region:"NorthEast",RegionCode:"NE" , Territory:"New York",TerritoryCode:"NY",
        Territory_Rep:"Jose Rodriguez", Actual:26992, Estimate:30000},
    {Region:"NorthEast", RegionCode:"NE",Territory:"New York",TerritoryCode:"NY",
        Territory_Rep:"lisa Sims", Actual:47885, Estimate:50000},
    {Region:"NorthEast", RegionCode:"NE", Territory:"Massachusetts",TerritoryCode:"MA",
        Territory_Rep:"kelly o'connell", Actual:172911, Estimate:20000},
    {Region:"NorthEast", RegionCode:"NE", Territory:"Pennsylvania",TerritoryCode:"PA",
        Territory_Rep:"John Barnes", Actual:32105, Estimate:30000},
    {Region:"MidWest",  RegionCode:"NE", Territory:"Illinois",TerritoryCode:"IL",
        Territory_Rep:"Seth Brown", Actual:42511, Estimate:40000}];

    var regions = this.groupBy(dpFlat,"Region", "(None)", null, ['RegionCode']);
    for(var i=0;i<regions.length;i++){
        var region=regions[i];
        region.children = this.groupBy(region.children,"Territory", "(None)", null, ['TerritoryCode']);
    }
    grid.setDataProvider(regions);
  }

groupBy(dp, prop, nullValue,filterfunction,additionalProperties, useOtherBucket){
    if(!additionalProperties)additionalProperties=[];
    var buckets = {};
    var key;
    var result = [];
    //iterate through the flat list and create a hierarchy
    if(useOtherBucket){
        buckets["other"] = [];
    }
    for(var i=0;i<dp.length;i++){
        var item=dp[i];
        key = flexiciousNmsp.UIUtils.resolveExpression(item,prop); //the parent
        if(!buckets[key]){
            buckets[key] = [];//the children
        }
        if(filterfunction==null || filterfunction(item))
            buckets[key].push(item); //add to the parents child list
        else if(useOtherBucket){
            buckets["other"].push(item);
        }
    }
    for (key  in buckets){
        var obj = {};
        obj[prop]=key=="null"?nullValue:key;
        obj['children']=buckets[key];
        if(buckets[key].length>0){
            for(var j=0;j<additionalProperties.length;j++){
                var addProp=additionalProperties[j];
                obj[addProp] = buckets[key][0][addProp];
            }
        }
        result.push(obj); //create the final structure
    }
    return result; //this will refresh the grid...

};

  render() {
    return (
      <div>
        <h1 className='page-title'>Multiple Grouping Manual</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid  width={"100%"} ref={(grid) => { this.grid = grid; }} color="0x323232" preferencePersistenceKey="multipleGrouping_Manual">
            <ReactDataGridColumnLevel childrenField="children" enableFooters >
              
                <ReactDataGridColumn dataField="Region" enableHierarchicalNestIndent />
                <ReactDataGridColumn dataField="RegionCode" />
              
              
                <ReactDataGridColumnLevel enableFooters childrenField="children">
                  
                    <ReactDataGridColumn dataField="Territory" />
                    <ReactDataGridColumn dataField="TerritoryCode" />
                  
                  
                    <ReactDataGridColumnLevel enableFooters childrenCountField="numChildren">
                      
                        <ReactDataGridColumn dataField="Territory_Rep" headerText="Territory Rep" />
                        <ReactDataGridColumn dataField="Actual" />
                        <ReactDataGridColumn dataField="Estimate" />
                      
                    </ReactDataGridColumnLevel>
                  
                </ReactDataGridColumnLevel>
              
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


