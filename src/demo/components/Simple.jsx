import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import BusinessService from '../mockdata/BusinessService'
export default class Simple extends React.Component {
  constructor(){
    super();
    this.state = {
      dataProvider : null //we set it to null, because if we set it to an emtpy array the grid will think that you are giving it a zero record dataprovider 
      //and show a "No records found" message.
    } 
  }
  componentDidMount() {
    BusinessService.getInstance().getFlatOrgList((evt, token) => {
      this.setState({ dataProvider: evt.result });
    });
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Simple Grid</h1>
        <FullWidthSection useContent={true}>
          <ReactDataGrid ref={'grid'} width={"100%"} dataProvider={this.state.dataProvider} enablePrint enablePreferencePersistence enableDrag showSpinnerOnFilterPageSort enableEagerDraw
            enableDrop enableExport enableCopy preferencePersistenceKey={'simpleGrid'} enableMultiColumnSort useCompactPreferences horizontalScrollPolicy={'auto'}
            footerDrawTopBorder enablePdf headerRowHeight={100}>
            <ReactDataGridColumnLevel selectedKeyField={'id'} enablePaging pageSize={50} enableFilters enableFooters initialSortField={'legalName'} initialSortAscending>
              <ReactDataGridColumn id={'colId'} dataField={'id'} headerText={'ID'} filterControl={'TextInput'} filterWaterMark={'Search'} columnLockMode={'left'}
                filterIcon={'http://www.htmltreegrid.com/demo/flexicious/css/images/search_clear.png'} enableFilterAutoComplete clearFilterOnIconClick />
              <ReactDataGridColumn id={'colLegalName'} dataField={'legalName'} sortCaseInsensitive headerText={'Legal Name of the Organization'} headerWordWrap truncateToFit columnLockMode={'left'} />
              <ReactDataGridColumn id={'colLine1'} dataField={'headquarterAddress.line1'} headerText={'Line 1'} footerLabel={'Count:'} footerOperation={'count'} />
              <ReactDataGridColumn id={'colLine2'} dataField={'headquarterAddress.line2'} headerText={'Line 2'} />
              <ReactDataGridColumn id={'colCity'} dataField={'headquarterAddress.city.name'} headerText={'City'} filterControl={'MultiSelectComboBox'}
                 filterComboBoxBuildFromGrid />
              <ReactDataGridColumn id={'colState'} dataField={'headquarterAddress.state.name'} headerText={'State'} filterControl={'MultiSelectComboBox'}
                 filterComboBoxBuildFromGrid />
              <ReactDataGridColumn id={'colCountry'} dataField={'headquarterAddress.country.name'} headerText={'Country'} filterControl={'MultiSelectComboBox'}
                 filterComboBoxBuildFromGrid />
              <ReactDataGridColumn headerAlign={'right'} id={'colAnnRev'} dataField={'annualRevenue'} headerText={'Annual Revenue'} headerWordWrap
                textAlign={'right'} footerLabel={'Avg:'} footerOperation={'average'} footerAlign={'center'} footerOperationPrecision={'2'}
                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} filterControl={'NumericRangeBox'} sortNumeric
                footerFormatter={flexiciousNmsp.CurrencyFormatter} />
              <ReactDataGridColumn headerAlign={'right'} id={'colNumEmp'} headerWordWrap sortNumeric dataField={'numEmployees'} headerText={'Num Employees'} textAlign={'right'}
                footerLabel={'Avg:'} footerOperation={'average'} footerOperationPrecision={'2'} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn headerAlign={'right'} id={'colEPS'} headerWordWrap sortNumeric dataField={'earningsPerShare'} headerText={'EPS'} textAlign={'right'}
                footerLabel={'Avg:'} footerOperation={'average'}
                footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn headerAlign={'right'} id={'colStockPrice'} headerWordWrap sortNumeric dataField={'lastStockPrice'} headerText={'Stock Price'}
                footerFormatter={flexiciousNmsp.CurrencyFormatter} textAlign={'right'} footerLabel={'Avg:'} footerOperation={'average'}
                footerOperationPrecision={'2'} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
              <ReactDataGridColumn excludeFromSettings excludeFromPrint excludeFromExport />
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


