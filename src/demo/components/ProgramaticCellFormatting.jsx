import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
export default class ProgramaticCellFormatting extends React.Component {


    getRowBackground(cell) {

        if (cell.rowInfo.getData().headquarterAddress.state.name == "New York") {
            return 0xCFCFCF;
        } else if (cell.rowInfo.getIsFillRow()) {
            return [0xCFCFCF, 0xFFFFFF]
        }
        return null;

    }

    getRowDisabled(cell, data) {

        if (data.legalName == 'Adobe Systems') {
            return true;
        }
        return false;//do not disable by default.

    }

    getRowTextColor(cell) {

        if (cell.rowInfo.getData().headquarterAddress.state.name == "New York") {
            return 0xCC3300;
        }
        return null;

    };

    getColumnBackground(cell) {

        if (cell.getLevel().getSelectedKeys().indexOf(UIUtils.resolveExpression(cell.getRowInfo().getData(), cell.level.selectedKeyField)) > -1) {
            return cell.getLevel().grid.getStyle("selectionColor");
        }
        var val = UIUtils.resolveExpression(cell.getRowInfo().getData(), cell.getColumn().dataField);
        if (val < 10000) {
            return 0xCC3300;
        } else if (val > 50000) {
            return 0x66BB88;
        }
        else {
            return null;
        }

    }

    getColumnTextColor(cell) {

        var val = UIUtils.resolveExpression(cell.getRowInfo().getData(), cell.getColumn().dataField);
        if (val < 10000) {
            return 0xFFFFFF;
        } else if (val > 50000) {
            return 0x000000;
        }
        else {
            return 0x000000;
        }

    }



    render() {
        return (
            <div>
                <h1 className='page-title'>Programmatic Cell Formatting</h1>
                <FullWidthSection useContent={true}>
                    <ReactDataGrid  width={"100%"} ref="grid" horizontalScrollPolicy="off" enableEagerDraw enableFooters enableFilters enableExport 
                        dataProvider={FlexiciousMockGenerator.instance().getDeepOrgListSync()}
                        preferencePersistenceKey="programaticCellFormatting" forcePagerRow>
                        <ReactDataGridColumnLevel selectedKeyField="id"
                            rowBackgroundColorFunction={this.getRowBackground}
                            rowDisabledFunction={this.getRowDisabled}
                            rowTextColorFunction={this.getRowTextColor} >
                            <ReactDataGridColumn type="checkbox" />
                            <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" />
                            <ReactDataGridColumn dataField="legalName" headerText="Legal Name" />
                            <ReactDataGridColumn dataField="headquarterAddress.line1" headerText="Address Line 1" footerLabel="Count:" footerOperation="count" />
                            <ReactDataGridColumn dataField="headquarterAddress.line2" headerText="Address Line 2" />
                            <ReactDataGridColumn dataField="headquarterAddress.city.name" headerText="City" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid
                                filterComboBoxWidth={150} />
                            <ReactDataGridColumn dataField="headquarterAddress.state.name" headerText="State" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid
                                filterComboBoxWidth={150} />
                            <ReactDataGridColumn dataField="headquarterAddress.country.name" headerText="Country" filterControl="MultiSelectComboBox"
                                filterComboBoxBuildFromGrid filterComboBoxWidth={150} />
                            <ReactDataGridColumn width={100} columnWidthMode="fixed" cellBackgroundColorFunction={this.getColumnBackground}
                                cellTextColorFunction={this.getColumnTextColor}  headerAlign="right" dataField="annualRevenue" headerText="Annual Revenue" textAlign="right" headerAlign="right" headerAlign="center"
                                footerLabel="Avg:" footerOperation="average" footerAlign="center" footerOperationPrecision={2}
                                footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                            <ReactDataGridColumn width={100} columnWidthMode="fixed" headerAlign="right"  cellBackgroundColorFunction={this.getColumnBackground}
                                cellTextColorFunction={this.getColumnTextColor} dataField="numEmployees" headerText="Num Employees" textAlign="right" headerAlign="right" footerLabel="Avg:"
                                footerOperation="average" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                            <ReactDataGridColumn width={100} columnWidthMode="fixed" headerAlign="right"  dataField="earningsPerShare" headerText="EPS" textAlign="right" headerAlign="right"
                                footerLabel="Avg:" footerOperation="average" footerFormatter={flexiciousNmsp.CurrencyFormatter}
                                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                            <ReactDataGridColumn width={100} columnWidthMode="fixed" headerAlign="right" dataField="lastStockPrice" headerText="Stock Price" textAlign="right" headerAlign="right" footerLabel="Avg:"
                                footerOperation="average" footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                                labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                        </ReactDataGridColumnLevel>
                    </ReactDataGrid>
                </FullWidthSection>
            </div>
        );
    }
}

