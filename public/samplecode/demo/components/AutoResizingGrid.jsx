import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import RaisedButton from 'material-ui/RaisedButton';
import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
let listOfObjects = [];
let number = 1;
export default class AutoResizingGrid extends React.Component {
  constructor() {
    super();
  }
  addNewObject(evt) {
    const grid = this.refs.grid;
    var newObject = {};
    newObject.number = number++;
    newObject.value = 1.0;
    listOfObjects.push(newObject);
    grid.rebuild();
  }
  componentDidMount() {
    const grid = this.refs.grid;
    listOfObjects = [];
    grid.setDataProvider(listOfObjects);
    for (var i = 0; i < 3; i++) {
      this.addNewObject();
    }

  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Auto Resizing Grid</h1>
        <FullWidthSection useContent={true}>
          <RaisedButton onTouchTap={this.addNewObject.bind(this)} label={"Add Item"} />

          <ReactDataGrid ref="grid" width={"100%"} height={300} enablePrint enableHeightAutoAdjust enablePreferencePersistence
            enableDrillDown enableSelectionCascade enableExport enableCopy
            preferencePersistenceKey="autoResiziingGrid"  />

        </FullWidthSection>
      </div>
    );
  }
} 
