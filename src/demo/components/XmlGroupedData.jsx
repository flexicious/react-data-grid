import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class XMLGroupedData extends React.Component {
  constructor() {
    super();
  }

  static getFooter(col/*FlexDataGridColumn */, cell/*FlexDataGridFooterCell*/) {

    // var val = cell.getRowInfo().getData();
    // return XMLGroupedData.getTotal(val, cell.getLevel().getNestDepth(),
    //   cell.getColumn().getDataField(), true);

    var val = null;
    var nestDepth = 1;

    if (cell == null) {
        //cell will be null in export mode. In that case, we look at the currentExportLevel for the 
        //level at which the export is happening. 
        //Since we are calculating a footer cell, we need the list of items that makeup this footer.
        //At the top level, our list of items is the dataprovider
        //itself. At inner levels, we figure out the parent object, and get its children
        nestDepth = col.level.grid.currentExportLevel.getNestDepth();
        if (nestDepth == 1)
            val = col.level.grid.getDataProvider();
        else
            val = col.level.grid.getParent(this.grid.recordBeingExported, this.grid.currentExportLevel);
    } else {
        nestDepth = cell.level.nestDepth;
        val = cell.getRowInfo().getData();
    }
    return XMLGroupedData.getTotal(val, nestDepth, col.getDataField(), true);

  };

  static getTotal(val, nestDepth, dataField, usePrefix) {

    var arr = [];
    var lbl = "";
    var regionGroup;
    var region;
    var rep;
    var i, j, p;
    var items, items2;
    if (val instanceof Array) {
      //the top level footers converts the root to a flat array.
      for (i = 0; i < val.length; i++) {
        regionGroup = val[i];
        items = regionGroup.children;
        for (p = 0; p < items.length; p++) {
          region = items[p];
          items2 = region.children || [region.Territory_Rep];
          for (j = 0; j < items2.length; j++) {
            rep = items2[j];
            arr.push({ "value": rep[dataField] });
          }
        }
      }
    }
    else if (nestDepth == 1) {
      for (i = 0; i < val.children.length; i++) {
        regionGroup = val.children[i];
        items = regionGroup.children;
        for (j = 0; j < items.length; j++) {
          region = items[j];
          items2 = region.children;
          for (k = 0; k < items2.length; k++) {
            rep = items2[k];
            arr.push({ "value": rep[dataField] });
          }
        }
      }
    }
    else if (nestDepth == 2) {
      for (i = 0; i < val.children.length; i++) {
        var region1 = val.children[i];
        var items3 = region1.children || [region1.Territory_Rep];
        for (j = 0; j < items3.length; j++) {
          var rep1 = items3[j];
          arr.push({ "value": rep1[dataField] });
        }
      }
      lbl = "Region "
    }
    else if (nestDepth == 3) {
      items = val.children || [val.Territory_Rep]
      for (var k = 0; k < items.length; k++) {
        var rep2 = items[k];
        arr.push({ "value": rep2[dataField] });
      }
      lbl = "State "
    }
    return (usePrefix ? lbl + "Sum:" : "") + UIUtils.formatCurrency(UIUtils.sum(arr, "value"));

  };

  static getDataValue(item, col, cell) {
    if (typeof cell == "undefined") cell = null;

    var val = "";
    //var nestDepth = cell.getLevel().getNestDepth();
    var nestDepth = 1;

    if (cell == null) {
        //cell will be null in export mode. In that case, because we need level, we use this.grid.currentExportLevel
        nestDepth = col.level.grid.currentExportLevel.getNestDepth();
    }
    else {
        nestDepth = cell.level.getNestDepth();
    }

    if (nestDepth == 3) {
      val = UIUtils.resolveExpression(item, col.getDataField());
      return val ? UIUtils.formatCurrency(parseFloat(val.toString())) : "";
    }
    return XMLGroupedData.getTotal(item, nestDepth + 1, col.getDataField(), false);

  };

  componentDidMount() {
    const grid = this.grid;
    const json = UIUtils.xml2json(FlexiciousMockGenerator.dpHierarchyXML);
    grid.setDataProvider(json.Region);
    grid.getColumnLevel().setColumnWidthsUsingWidthMode(true);
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Hierarchical XML Data</h1>
        <FullWidthSection useContent={true}>




          <ReactDataGrid width={"100%"} ref={(grid) => { this.grid = grid; }} enablePrint enablePreferencePersistence enableExport enableCopy enableFilters enableDrillDown enableFooters
            initialSortField="title" initialSortAscending forcePagerRow
            enableHideIfNoChildren preferencePersistenceKey="xmlGroupedData">

            <ReactDataGridColumn dataField="@Region" headerText="Region" />
            <ReactDataGridColumn dataField="@Territory_Rep" headerText="Territory Rep" filterControl="TextInput" filterOperation="BeginsWith" />
            <ReactDataGridColumn dataField="@Actual" headerText="Actual" footerAlign="right" textAlign="right" headerAlign="right" labelFunction2={XMLGroupedData.getDataValue}
              footerLabelFunction2={XMLGroupedData.getFooter} />
            <ReactDataGridColumn dataField="@Estimate" headerText="Estimate" footerAlign="right" textAlign="right" headerAlign="right" labelFunction2={XMLGroupedData.getDataValue}
              footerLabelFunction2={XMLGroupedData.getFooter} />

            <ReactDataGridColumnLevel reusePreviousLevelColumns enableFooters>
              <ReactDataGridColumnLevel reusePreviousLevelColumns enableFooters />
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}
