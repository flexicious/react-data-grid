import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import RaisedButton from 'material-ui/RaisedButton';
import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
let number = 1;
export default class AutoResizingGrid extends React.Component {
  constructor() {
    super();
    let dp = [];
    dp = this.addNewObject(dp);
    dp = this.addNewObject(dp);
    dp = this.addNewObject(dp);
    this.state = {
      dataProvider: dp
    };
    this.onAddItem = () => {
      this.setState({ dataProvider: this.addNewObject(this.state.dataProvider) });
    }
  }
  addNewObject(dp) {
    var newObject = {};
    newObject.number = number++;
    newObject.value = 1.0;
    return [
      ...dp,
      newObject
    ];
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Auto Resizing Grid</h1>
        <FullWidthSection useContent={true}>
          <RaisedButton onClick={this.onAddItem} label={"Add Item"} />
          <ReactDataGrid dataProvider={this.state.dataProvider} width={"100%"} height={300} enablePrint enableHeightAutoAdjust enablePreferencePersistence
            enableDrillDown enableSelectionCascade enableExport enableCopy
            preferencePersistenceKey="autoResiziingGrid" />
        </FullWidthSection>
      </div>
    );
  }
} 
