import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, NumberFormatter, TextInput, UIComponent } from './LibraryImports'
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import Employee from '../mockdata/Employee'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'

let numberFormatter = new NumberFormatter();

export default class DynamicLevels extends React.Component {
    constructor() {
        super();
    }

    gridchangeHandler(evt) {

        const grid = evt.currentTarget;
        var _selectedObjects = "";
        var items = grid.getSelectedObjects();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            _selectedObjects += item["@id"].toString() + ",";
        }
        var _openObjects = "";
        var items2 = grid.getOpenKeys();
        for (var j = 0; j < items2.length; j++) {
            var item3 = items2[j];
            _openObjects += item3 + ",";
        }

    };
    componentDidMount() {
        const grid = this.refs.grid;
        const json = UIUtils.xml2json(FlexiciousMockGenerator.dpHierarchyXML);
        grid.setDataProvider(json.Region);
    }
    render() {
        return (
            <div>
                <h1 className='page-title'>Dynamic Levels</h1>
                <FullWidthSection useContent={true}>
                    <ReactDataGrid width={"100%"} ref="grid" enablePrint change={this.gridchangeHandler}
                        enableDrillDown enableDynamicLevels enableSelectionBubble enableTriStateCheckbox enableExport enableCopy enableSelectionCascade
                        selectedKeyField="@id">
                        <ReactDataGridColumnLevel enableFooters >
                            <ReactDataGridColumn dataField="@Region" headerText="Region" enableHierarchicalNestIndent />
                            <ReactDataGridColumn type="checkbox" />
                            <ReactDataGridColumn dataField="@id" headerText="ID" />
                            <ReactDataGridColumn dataField="@Territory_Rep" headerText="Territory Rep" />
                            <ReactDataGridColumn dataField="@Actual" headerText="Actual" textAlign="right" headerAlign="right" headerAlign="center" footerLabel="Avg:" footerOperation="average"
                                footerAlign="center" footerOperationPrecision={2}
                                footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                            <ReactDataGridColumn dataField="@Estimate" headerText="Estimate" textAlign="right" headerAlign="right" headerAlign="center" footerLabel="Avg:" footerOperation="average"
                                footerAlign="center" footerOperationPrecision={2}
                                footerFormatter={flexiciousNmsp.CurrencyFormatter} labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
                        </ReactDataGridColumnLevel>
                    </ReactDataGrid>
                </FullWidthSection>
            </div>
        );
    }
}

