import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import BusinessService from '../mockdata/BusinessService'
export default class Outlook extends React.Component {
    constructor() {
        super();
        this.gridstyle = {
            verticalGridLines: false,
            horizontalGridLines: true,
            headerColors: [0xEEEEEE, 0xEEEEEE],
            headerRollOverColors: [0xEEEEEE, 0xEEEEEE],
            headerVerticalGridLineColor: 0xD0D0D0,
            filterColors: [0xEEEEEE, 0xEEEEEE],
            filterRollOverColors: [0xEEEEEE, 0xEEEEEE],
            filterVerticalGridLineColor: 0xD0D0D0,
            footerColors: [0xFFFFFF, 0xFFFFFF],
            footerRollOverColors: [0xFFFFFF, 0xFFFFFF],
            footerVerticalGridLines: false,
            footerHorizontalGridLineColor: 0xEDEDED,
            footerStyleName: "myHeader",
            headerStyleName: "myHeader",
            headerHorizontalGridLineColor: 0xD0D0D0,
            selectionColor: 0xCEDBEF,
            alternatingItemColors: [0xFFFFFF, 0xFFFFFF],
            rollOverColor: 0xFFFFFF,
            disclosureOpenIcon: "/minus.png",//make sure you put these images in flexiciousNmsp.Constants.IMAGE_PATH
            disclosureClosedIcon: "/plus.png",//make sure you put these images in flexiciousNmsp.Constants.IMAGE_PATH
            horizontalGridLineColor: 0x99BBE8
        }
    }
    componentDidMount() {
        const grid = this.refs.grid;
        BusinessService.getInstance().getDeepOrgList(function (evt, token) {
            grid.setDataProvider(evt.result);
            grid.hideSpinner();
        });
    }


    gridrendererInitializedHandler(evt) {

        var cell = event.cell;
        if ((cell.implementsOrExtends("IFlexDataGridDataCell"))) {//the dg has various types of cells. we only want to style the data cells...
            if (cell.level.getNestDepth() == 1) {
                //at the first level, we want font to be bold ...
                //cell.setStyle("fontWeight","bold");
                cell.setStyle("fontWeight", "bold");

            }
            else {
                cell.setStyle("fontWeight", "normal");
            }

        }

    };

    gridbeforePrintHandler(evt) {
        event.printGrid.styleName = "gridStyle";
    };

    getInvoiceAmount(data, col) {
        var val = 0;
        if (data.implementsOrExtends("Deal")) {
            var a = data.implementsOrExtends("Deal") ? data : null;
            val = a.getDealAmount();
        }
        else if (data.implementsOrExtends("Organization")) {
            var b = data.implementsOrExtends("Organization") ? data : null;
            val = b.getRelationshipAmount();
        }
        return UIUtils.formatCurrency(val);
    };

    amountSortCompareFunction(obj1, obj2) {
        if (obj1.implementsOrExtends("Organization ") && obj2.implementsOrExtends("Organization")) {
            return ObjectUtil.numericCompare(obj1.getRelationshipAmount(), obj2.getRelationshipAmount());
        }
        else if (obj1.implementsOrExtends("Deal") && obj2.implementsOrExtends("Deal")) {
            return ObjectUtil.numericCompare(obj1.getDealAmount(), obj2.getDealAmount());
        }
        else if (obj1.implementsOrExtends("Invoice") && obj2.implementsOrExtends("Invoice")) {
            return ObjectUtil.numericCompare(obj1.getInvoiceAmount(), obj2.getInvoiceAmount());
        }
        return 0;
    };

    getBlueColor(cell) {
        //since the text color changes when hte user hovers over, or selects (potentially) we always want it to be blue.
        return 0x3764A0;
    };

    render() {
        return (
            <div>
                <h1 className='page-title'>Custom Styling - Outlook</h1>
                <FullWidthSection useContent={true}>
                    <ReactDataGrid width={"100%"} ref="grid" styles={this.gridstyle} enablePrint enablePreferencePersistence enableDrillDown
                        preferencePersistenceKey="outlookGroupedData" enableEagerDraw showSpinnerOnFilterPageSort horizontalScrollPolicy="off" 
                        rendererInitialized={this.gridrendererInitializedHandler} enableExport enableCopy>
                        <ReactDataGridColumnLevel enablePaging pageSize={20} childrenField="deals" selectedKeyField="id" horizontalGridLineThickness={2}
                            headerPaddingTop={5} reusePreviousLevelColumns rowHeight="35" rowTextColorFunction={this.getBlueColor}
                            enableFilters initialSortField="legalName">
                            <ReactDataGridColumn dataField="legalName" headerText="Organization Name" filterControl="TextInput" filterOperation="BeginsWith" />
                            <ReactDataGridColumn dataField="dealDescription" headerText="Deal Description" />
                            <ReactDataGridColumn dataField="dealStatus.name" headerText="Deal Status" footerLabel="Count:" footerOperation="count" footerAlign="center" />
                            <ReactDataGridColumn dataField="dealAmount" headerText="Amount" textAlign="right" headerAlign="right" footerLabel="Total:" footerOperation="sum" footerAlign="right"
                                footerOperationPrecision={2} footerFormatter={flexiciousNmsp.CurrencyFormatter}
                                labelFunction={this.getInvoiceAmount}
                                sortCompareFunction={this.amountSortCompareFunction} />
                            <ReactDataGridColumn dataField="dealDate" headerText="Deal Date"
                                labelFunction={UIUtils.dataGridFormatDateLabelFunction} />
                            <ReactDataGridColumnLevel selectedKeyField="id" reusePreviousLevelColumns rowHeight={25}
                                horizontalGridLineColor="0xEDEDED" footerRowHeight={25} horizontalGridLineThickness={1} paddingTop={2} enableFooters
                                initialSortField="dealDate" initialSortAscending={false} />
                        </ReactDataGridColumnLevel>
                    </ReactDataGrid>
                </FullWidthSection>
            </div>
        );
    }
}


