import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';

let timer = null;
let repeatrate = 12;

export default class TraderView extends React.Component {
    constructor() {
        super();
        this.startTimer = this.startTimer.bind(this);
    }

    componentDidMount() {
        const grid = this.refs.grid;
        var stocks = [];
        for (var i = 0; i < 500; i++) {
            var chg = FlexiciousMockGenerator.getRandom(-10, 10);
            stocks.push({
                "id": i, "symbol": "TICK" + i, "name": "Ticker with symbol" + i
                , "last": FlexiciousMockGenerator.getRandom(20, 30), "change": chg + "%", "tickUp": (chg > 0)
            });
        }
        flexiciousNmsp.UIUtils.sortOn(stocks, "id");
        grid.setDataProvider(stocks);
        rateTextField.value = repeatrate;
        timer = new flexiciousNmsp.Timer(1000.0 / repeatrate);
        timer.addEventListener(this, flexiciousNmsp.Constants.EVENT_TIMER, this.updateTimerHandler.bind(this));

    }

    getCellTextColor(cell) {
        if (cell.getRowInfo().getData().tickUp)
            return 0x000000;
        else
            return 0xFFFFFF;
    }

    getCellBackgroundColor(cell) {
        if (cell.getRowInfo().getData().tickUp)
            return 0x11FF01;
        else
            return 0xFF0101;
    }

    startTimer(event, newValue) {
        if (!timer) {
            timer = new flexiciousNmsp.Timer(1000.0 / repeatrate);
            timer.addEventListener(this, flexiciousNmsp.Constants.EVENT_TIMER, this.updateTimerHandler.bind(this));
        }

        if (newValue) {
            timer.start();
        }
        else {
            timer.stop();
        }
    }

    updateTimerHandler(evt) {
        var fdg = this.refs.grid;
        //when this happens, we get a batch from the server that says tickers with XX ids have
        //new values...
        var affectedItems = [];
        //we just randomly update some 25 items out of the 100.
        for (var i = 0; i < 250; i++) {
            var random = FlexiciousMockGenerator.getRandom(0, fdg.getDataProvider().length - 1);
            var chg = FlexiciousMockGenerator.getRandom(-10, 10);
            fdg.getDataProvider()[random].last = FlexiciousMockGenerator.getRandom(20, 30)
            fdg.getDataProvider()[random].change = chg
            fdg.getDataProvider()[random].tickUp = chg > 0;
            affectedItems.push(fdg.getDataProvider()[random]);
        }

        //now the key here is to only update the cells that are affected.
        //this means we navigate to the row, get the affected cell, and invalidate it...
        //we go through the affectedItems, but keep in mind not all of the
        //affectedItems could be in view. So we check to see if anything is
        //drawn and if something is drawn, only then refresh it...
        var items = affectedItems;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            //now there is a function call - getCellByRowColumn on the grid.
            //that will quickly get you the cell to update. but in this case
            //since we are updating multiple cells in each row, we will just
            //get the row to update and use its cells collection to quickly
            //update them
            var rows = fdg.getBodyContainer().rows;
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                if (row.getData() == item) {
                    //this means we need to update his cells
                    row.cells[2].component.refreshCell();
                    row.cells[3].component.refreshCell();
                }
            }
        }
    }

    render() {
        return (
            <div>
                <h1 className='page-title'>Fast Live Updates</h1>
                <FullWidthSection useContent={true}>
                    <CheckBox style={{ width: 'auto' }} defaultChecked={false} label="Start" onCheck={this.startTimer} />
                    <TextField style={{ width: 'auto' }} id="rateTextField" onChange={(evt, newValue) => { repeatrate = newValue; } } />
                    <ReactDataGrid width={"100%"} ref="grid" preferencePersistenceKey="tradingView" horizontalScrollPolicy="off">
                        <ReactDataGridColumn headerText="Symbol" dataField="symbol" />
                        <ReactDataGridColumn headerText="Name" dataField="name" />
                        <ReactDataGridColumn headerText="Last" dataField="last" cellTextColorFunction={this.getCellTextColor} cellBackgroundColorFunction={this.getCellBackgroundColor} />
                        <ReactDataGridColumn headerText="Change" dataField="change" cellTextColorFunction={this.getCellTextColor} cellBackgroundColorFunction={this.getCellBackgroundColor} />
                    </ReactDataGrid>
                </FullWidthSection>
            </div>
        );
    }
}


