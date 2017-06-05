import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants, UIComponent, ComboBox, DatePicker } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
export default class ItemEditor extends React.Component {
  constructor() {
    super();
  }

  getRowDisabled(cell, data) {
    if (data.legalName == 'Adobe Systems') {
      return true;
    }
    return false;//do not disable by default.
  }

  itemEditValueCommitHandler(evt) {
    if (evt.column.dataField == "headquarterAddress.city.name") {
      var txt = evt.itemEditor["text"];
      var found = false;
      var items = flexiciousNmsp.SystemConstants.cities;
      for (var i = 0; i < items.length; i++) {
        var city = items[i];
        if (city.name == txt) {
          evt.item.headquarterAddress.city = city;
          found = true;
          break;
        }
      }
      if (!found) {
        window.alert("Invalid City Entered: " + txt);
      }
      event.preventDefault();//we do this, so when the value is entered, we validate and apply ourselves, dont let the grid apply it..
    }
  }

  validateFutureDate(editor) {
    var cell = grid.getCurrentEditCell();
    if ((editor.getSelectedDate() < new Date()) &&
      (editor.getSelectedDate().toString() != cell.getRowInfo().getData().addedDate.toString())) {
      window.alert("Please choose a date in the future.");
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Item Editors</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid  width={"100%"} horizontalScrollPolicy="off" rowDisabledFunction={this.getRowDisabled} editable enableFilters enableFooters ref={(grid) => { this.grid = grid; }} 
            itemEditValueCommit={this.itemEditValueCommitHandler} preferencePersistenceKey="editableCells" dataProvider={FlexiciousMockGenerator.instance().getFlatOrgList()}>
            <ReactDataGridColumn type="checkbox" />
            <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" editable selectable truncateToFit />
            <ReactDataGridColumn dataField="legalName" headerText="Legal Name" truncateToFit selectable editable />
            <ReactDataGridColumn dataField="headquarterAddress.line1" headerText="Address Line 1" footerLabel="Count:" footerOperation="count" editable />
            <ReactDataGridColumn dataField="headquarterAddress.line2" headerText="Address Line 2" />
            <ReactDataGridColumn dataField="headquarterAddress.city.name" headerText="City" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid
              filterComboBoxWidth="150" editable />
            <ReactDataGridColumn dataField="headquarterAddress.state.name" headerText="State" filterControl="MultiSelectComboBox"
              filterComboBoxBuildFromGrid filterComboBoxWidth="150" editable itemEditorManagesPersistence useFilterDataProviderForItemEditor
              itemEditor={ComboBoxItemEditor} />
            <ReactDataGridColumn dataField="addedDate" headerText="Added Date" itemEditor={DatePicker} format="date" editable editorDataField="selectedDate" />
            <ReactDataGridColumn dataField="headquarterAddress.country.name" headerText="Country" filterControl="MultiSelectComboBox"
              filterComboBoxBuildFromGrid filterComboBoxWidth="150" editable={false} />
            <ReactDataGridColumn dataField="annualRevenue" headerText="Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center" footerLabel="Avg:" footerOperation="average"
              footerAlign="center" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
              labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} editable />
            <ReactDataGridColumn dataField="numEmployees" headerText="Num Employees" textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
              footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
              labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} editable />
            <ReactDataGridColumn dataField="earningsPerShare" headerText="EPS" textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
              footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} editable />
            <ReactDataGridColumn dataField="lastStockPrice" headerText="Stock Price" textAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerOperationPrecision={2}
              footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} editable />
          </ReactDataGrid>

        </FullWidthSection>
      </div>
    );
  }
}

/**
 * A ComboBoxItemEditor is a custom item renderer, that defines how to use custom cells with logic that you can control
 * @constructor
 * @namespace flexiciousNmsp
 */
class ComboBoxItemEditor extends ComboBox {
  constructor() {
    //make sure to call constructor
    super();//we extend from the built in flexicious combobox, which gives us a bunch of properties (like selected value etc)
    /**
     * This is a getter/setter for the data property. When the cell is created, it belongs to a row
     * The data property points to the item in the grids dataprovider that is being rendered by this cell.
     * @type {*}
     */
    this.data = null;
    this.ignoreAllItem=(true);

    //the add event listener will basically proxy all DomEvents to your code to handle.
    this.addEventListener(this, Constants.EVENT_CHANGE, this.onChange);
  }

  getClassNames() {
    return ["ComboBoxItemEditor", "UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
  }

  /**
   * This is important, because the grid looks for a "setData" method on the renderer.
   * In here, we intercept the call to setData, and inject our logic to populate the combo box.
   * @param val
   */
  initialize() {
    flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
    this.dataField = "code";// the code field is used on the data provider to match the item to select.
    this.labelField = "name";//to display the text of the dropdown
    this.setDataProvider(flexiciousNmsp.SystemConstants.states);//list of all states we want as the dataprovider;
    const cell = this.grid.getCurrentEditCell();//each editor gets a grid parameter. Also parent object of this cell is either the leftLocked or the rightLocked, or the unlocked containers, all of which have a grid property.
    this.setValue(cell.getRowInfo().getData().headquarterAddress.state.code);
  }

  /**
   * This event is dispatched when the user clicks on the icon. The event is actually a flexicious event, and has a trigger event
   * property that points back to the original domEvent.
   * @param event
   */
  onChange(evt) {
    //in the editor you have a handle to the grid iteself.
    this.grid.getCurrentEditCell().getRowInfo().getData().headquarterAddress.state = this.getSelectedItem();
  }
}


