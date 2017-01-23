import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import Employee from '../mockdata/Employee'
import TextInput from '../../js/controls/TextInput'
import RaisedButton from 'material-ui/RaisedButton';

export default class CustomMatchFilterControl extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    const grid = this.refs.grid;
    grid.setDataProvider(Employee.allEmployees);

  }
  getFullName(item, col) {
    return item.firstName + " " + item.lastName;
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Custom Match Filter Control</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid  width={"100%"} ref="grid" enableFilters enableCopy enableFooters enablePaging
            pageSize={25} filterRowHeight={40} footerRowHeight={60} >
            <ReactDataGridColumn headerText="Name" labelFunction={this.getFullName}
              filterRenderer={CustomMatchTextBoxRenderer} />
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}

/**
 * A TextInputRenderer is a custom item renderer, that defines how to use custom cells with logic that you can control
 * @constructor
 * @namespace flexiciousNmsp
 * @extends TextInput
 */
class CustomMatchTextBoxRenderer extends TextInput {

  getClassNames() {
    //we need to implement ICustomMatchFilterControl because we want to tell the grid to call our isMatch method to do the filter
    //we need to implement IFilterControl to tell the grid that we are actually a filter control, and not a placeholder for non-filterable columns
    //we need to implement iDelayedChange so that the grid listens to our "delayedChange" event, and not the regular change method.
    //if we had set filterTriggerEvent on the column to "enterKeyUp", we would not have had to implement IDelayedChange, but then the
    //user would have had to hit the enter key to run the filter.
    return ["CustomMatchTextBoxRenderer", "UIComponent", "ICustomMatchFilterControl", "IFilterControl", "IDelayedChange"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages. We need to

  }

  isMatch(emp) {
    const text = this.getText();
    if (emp && text.length > 0) {
      return emp.firstName.toLowerCase().includes(text.toLowerCase()) || emp.lastName.toLowerCase().includes(text.toLowerCase());
    }
    return true;
  }
}
CustomMatchTextBoxRenderer.prototype.typeName = CustomMatchTextBoxRenderer.typeName = 'CustomMatchTextBoxRenderer';//for quick inspection

