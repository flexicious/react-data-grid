import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, Constants, UIComponent } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class IconColumns extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.grid;
    grid.setDataProvider(FlexiciousMockGenerator.instance().getFlatOrgList());
  }
  /**
   *
   * @param cell
   * @param state
   * @return {*}
   */
  dynamicIconFunction(cell, state) {
    if (typeof state == "undefined") state = '';

    if (cell.getRowInfo().getIsDataRow()) {
      return flexiciousNmsp.Constants.IMAGE_PATH + (cell.getRowInfo().rowPositionInfo.getRowIndex() % 2 == 0 ? '/upIcon.png' : '/downIcon.png');
    }
    return null;

  };

  /**
   *
   * @param cell
   * @return {String}
   */
  dynamicTooltipFunction(cell) {

    return "This is a dynamic tooltip for " + cell.getRowInfo().getData().legalName;

  };
  render() {
    return (
      <div>
        <h1 className='page-title'>Icon Columns</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid width={"100%"} ref={(grid) => { this.grid = grid; }} enableFooters enableFilters preferencePersistenceKey={"IconColumns"} horizontalScrollPolicy="off">
            <ReactDataGridColumnLevel >
              <ReactDataGridColumn hideText enableIcon icon="images/info.gif" iconToolTip="This column shows only an icon, no text."
                iconHandCursor  width={30} iconLeft={10} headerText="Icon Only"/>
              <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" />
              <ReactDataGridColumn dataField="legalName" headerText="Legal Name" />
              <ReactDataGridColumn dataField="annualRevenue" headerText="Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center"
                footerLabel="Avg:" footerOperation="average" footerAlign="center" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} enableIcon icon="/images/info.gif"
                iconToolTip="This is a static tooltip" paddingRight={20} iconRight={5} iconHandCursor filterControl="TextInput" />
              <ReactDataGridColumn dataField="numEmployees" headerText="Num Employees" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
                footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction}
                enableIcon icon="images/info.gif" iconToolTipFunction={this.dynamicTooltipFunction}
                paddingRight={20} iconRight={5} iconHandCursor showIconOnRowHover filterControl="TextInput" />
              <ReactDataGridColumn iconTooltipRenderer={IconTooltipRenderer} dataField="earningsPerShare" headerText="EPS"
                textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average" footerFormatter={flexiciousNmsp.CurrencyFormatter}
                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} enableIcon iconHandCursor showIconOnCellHover
                icon="images/search.png" iconLeft={5} filterControl="TextInput">
              </ReactDataGridColumn>
              <ReactDataGridColumn dataField="lastStockPrice" headerText="Stock Price" textAlign="right" headerAlign="right" headerAlign="right" footerLabel="Avg:" footerOperation="average"
                footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} enableIcon
                iconFunction={this.dynamicIconFunction} paddingRight={20} iconRight={5} iconHandCursor />

            </ReactDataGridColumnLevel>
          </ReactDataGrid>


        </FullWidthSection>
      </div>
    );
  }
}
/**
 * A IconTooltipRenderer is a custom item renderer, that defines how to use custom cells with logic that you can control
 * @constructor
 * @namespace flexiciousNmsp
 */
class IconTooltipRenderer extends UIComponent {
  constructor() {
    super();
    //make sure to call constructor
    /**
     * This is a getter/setter for the data property. When the cell is created, it belongs to a row
     * The data property points to the item in the grids dataprovider that is being rendered by this cell.
     * @type {*}
     */
    this.data = null;
    this.grid = null;//this gets you a pointer to the grid.
    // this.domElement.style.position="absolute";
    this.setHeight(350);
    this.setWidth(270);
    this.setStyleAttribute("position", "absolute");
    this.addEventListener(this, Constants.EVENT_CLICK, this.onPopupClick);
  }

  getClassNames() {
    return ["IconTooltipRenderer", "UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
  }

  /**
   * This is important, because the grid looks for a "setData" method on the renderer.
   * In here, we intercept the call to setData, and inject our logic to populate the text input.
   * @param val
   */
  setData(val) {
    flexiciousNmsp.UIComponent.prototype.setData.apply(this, [val]);
  }
  render() {
    const val = this.data;
    this.children = [<div className={"flexiciousGrid"}
      style={{ alpha: 0.9, backgroundColor: "#FFFF99", border: "solid 1px black", overflow: "hidden", padding: "2px" }}>
      <bold>This is a custom interactive tooltip</bold><br /> Note that you can reference the row data like this : {val.legalName}.
  You can put interactive content within this popup, for example , you can click the Edit Reason link below (to potentially launch another window).
  The popup will stay in place unless move the mouse out of the popup, or click the close popup button below. "
  <div style={{ float: "right", margin: "10px" }}>
        <a className=" button">Edit Reason</a>
        <a className=" button" onClick={this.grid.hideTooltip.bind(this.grid)}>Close Popup</a>
      </div>
    </div>]

    return super.render();
  }
  onPopupClick(evt) {
    const t = evt.target;
    if (evt.triggerEvent.target.text == "Close Popup") {
      this.grid.hideTooltip();
    }
  }
}

IconTooltipRenderer.prototype.typeName = IconTooltipRenderer.typeName = 'IconTooltipRenderer';//for quick inspection


