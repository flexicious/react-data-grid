import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SampleData from '../mockdata/SampleData'

export default class SelectionUI2 extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.refs.grid;
    grid.setDataProvider(SampleData.networkData);
    grid.validateNow();
    grid.expandAll();
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Selection UI 2</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid  width={"100%"} variableRowHeight editable ref="grid" titleIcon="http://www.flexicious.com/resources/images/device_red.png" disabledField="disabled"
           enableSelectionCascade enableFilters enableMultiColumnSort enableAutoRefresh maxAutoAdjustHeight="300" 
           enableDrag headerVerticalGridLineThickness="0" lockedSeperatorThickness="0" enableDynamicLevels 
           forcePagerRow preferencePersistenceKey="selectedUI2" enableDefaultDisclosureIcon={false} filterExcludeObjectsWithoutMatchField>
            <ReactDataGridColumnLevel childrenField="items" hierarchicalNestIndent={25}>
              <ReactDataGridColumn type="checkbox" width="200" filterPaddingLeft={20} headerPaddingLeft={20} excludeFromSettings={false} 
              allowSelectAll={false} enableLabelAndCheckBox headerText="Name" paddingRight="15" paddingLeft={20} enableRecursiveSearch dataField="groupName" filterControl="TextInput" sortCaseInsensitive filterOperation="BeginsWith" enableHierarchicalNestIndent enableExpandCollapseIcon enableQuickView showIconOnRowHover editable={false} />
              <ReactDataGridColumn headerText="Description" width={150} dataField="description" wordWrap enableQuickView paddingRight={10} 
              filterControl="TextInput" filterOperation="BeginsWith" showIconOnCellHover enableRecursiveSearch />
              <ReactDataGridColumn headerText="Type" dataField="family" enableObjectSelectorItemEditor filterControl="TextInput" filterOperation="BeginsWith" enableRecursiveSearch />
              <ReactDataGridColumn headerText="IP Address" dataField="address" filterControl="TextInput" filterOperation="EndsWith" editorStyleName="editableTextInput" editable enableRecursiveSearch />
              <ReactDataGridColumn headerText="Vendor" dataField="vendor" filterControl="TextInput" filterOperation="BeginsWith" enableRecursiveSearch />
            </ReactDataGridColumnLevel>

          </ReactDataGrid>

        </FullWidthSection>
      </div>
    );
  }
}


