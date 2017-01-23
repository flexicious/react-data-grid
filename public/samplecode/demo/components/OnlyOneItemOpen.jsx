import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class OnlyOneItemOpen extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.refs.grid;
  }

  itemOpeningHandler(evt) {
    const grid = evt.currentTarget;
    evt.preventDefault();
    var itemsToRemove = [];
    var items = grid.getOpenItems();
    for (var i = 0; i < items.length; i++) {
      var openItem = items[i];
      //need to ensure we do not close our own parent
      if (this.delegate.existsInParentHierarchy(openItem, evt.item)) {
        continue;
      } else {
        itemsToRemove.push(openItem);
      }
    }
    //remove all open items except our ancestors
    for (var j = 0; j < itemsToRemove.length; j++) {
      var itemToRemove = itemsToRemove[j];
      grid.getOpenItems().splice(grid.getOpenItems().indexOf(itemToRemove), 1);
    }
    //add ourselves
    grid.getOpenItems().push(evt.item);
    grid.rebuildBody();//rebuild the body

  };

  existsInParentHierarchy(openItem, item) {

    if (item == openItem) {
      return true;
    }
    if (item.parent) {
      return existsInParentHierarchy(openItem, item.parent); //since this is xml, we are using item.getParent(). We could also use grid.getParent(item) for non-lazy loaded grids.
    }
    return false;

  };

  render() {
    return (
      <div>
        <h1 className='page-title'>Only One Item Open</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid delegate={this} width={"100%"} ref="grid" enableFooters initialSortField="title" initialSortAscending forcePagerRow
            dataProvider={UIUtils.xml2json(FlexiciousMockGenerator.dpHierarchyXML, null, true).Region} preferencePersistenceKey="onlyOneItemOpen"
            onItemOpening={this.itemOpeningHandler}>
            <ReactDataGridColumnLevel>
              <ReactDataGridColumn dataField="@Region" headerText="Region" />
              <ReactDataGridColumn dataField="@Territory_Rep" headerText="Territory Rep" />
              <ReactDataGridColumn dataField="@Actual" headerText="Actual" />
              <ReactDataGridColumn dataField="@Estimate" headerText="Estimate" />
              <ReactDataGridColumnLevel reusePreviousLevelColumns enableFooters>
                <ReactDataGridColumnLevel reusePreviousLevelColumns enableFooters />
              </ReactDataGridColumnLevel>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


