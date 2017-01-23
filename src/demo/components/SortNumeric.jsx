import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

let ArrCol;
export default class SortNumeric extends React.Component {
  constructor() {
    super();
    ArrCol = [{ label: "Company A", state: "NJ", rank: "1.11" },
    { label: "Company B", state: "PA", rank: "11.1" },
    { label: "Company C", state: "CT", rank: "-111" },
    { label: "Company D", state: "NY", rank: "2.34" },
    { label: "Company E", state: "NJ", rank: "22.2" }];
  }

  componentDidMount() {
    const grid = this.refs.grid;
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Numeric Sort</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid width={"100%"} editable dataProvider={ArrCol}>

            <ReactDataGridColumn dataField="label" />
            <ReactDataGridColumn dataField="state" />
            <ReactDataGridColumn dataField="rank" sortNumeric />

          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


