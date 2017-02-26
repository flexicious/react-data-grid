
import { Constants, StyleDefaults } from 'flexicious-react-datagrid'
import Demo from './demo/Demo'
import { BaseAdapter, CssStyles } from 'flexicious-react-datagrid-styles'
import React from 'react';
import ReactDOM from 'react-dom';
var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();

window.React = React;
window.ReactDOM = ReactDOM;

Constants.IMAGE_PATH = "http://reactdatagrid.com/images";
//here, we will override the default styles to look more "material"
//There are 2 ways to style the DataGrid - css, and API - the API provides more fine grained controls, the kind css cannot
//But you can override both css and API - below is how you modify API styles. For modifying css styles, just include css classes
//found here : https://github.com/flexicious/react-datagrid-styles/blob/master/src/styles/css/App.scss in your own css
StyleDefaults.defaults = {
    /**
     * The root of all images. The Pager Control uses this, the grid expand collapse icons (see below) uses this,
     * So does the Search Clear icon as well as the sort icon.
     */
    imagesRoot:"http://reactdatagrid.com/images",
    /**
     *  The color of the line to draw when the user is moving or resizing the column
     */
    columnMoveResizeSeparatorColor: 0x000000,
    columnMoveAlpha: 0.8,
    backgroundColor: [0xFFFFFF, 0xFFFFFF],
    alternatingItemColors:  [0xFFFFFF, 0xFFFFFF],
    alternatingTextColors:  [0x000000, 0x000000],

    dragAlpha:0.8,
    dragRowBorderStyle:"solid",
    editItemColors:  [0xFFFFFF, 0xFFFFFF],
    editTextColor: 0x000000,

    errorBackgroundColor: 0xFCDCDF,
    errorBorderColor: 0xF23E2C,

    verticalGridLineColor: 0x696969,
    verticalGridLines:false,
    verticalGridLineThickness:1,


    horizontalGridLineColor: 0xcccccc,
    horizontalGridLines:true,
    horizontalGridLineThickness:1,

    textDisabledColor: 0xAFAFAF,


    columnGroupVerticalGridLineColor: 0xcccccc,
    columnGroupVerticalGridLines:true,
    columnGroupVerticalGridLineThickness:1,

    columnGroupHorizontalGridLineColor: 0xcccccc,
    columnGroupHorizontalGridLines:true,
    columnGroupHorizontalGridLineThickness:1,
    columnGroupDrawTopBorder:false,



    headerVerticalGridLineColor: 0xcccccc,
    headerVerticalGridLines:false,
    headerVerticalGridLineThickness:1,

    headerHorizontalGridLineColor: 0xcccccc,
    headerHorizontalGridLines:true,
    headerHorizontalGridLineThickness:1,
    headerDrawTopBorder:false,
    headerSortSeparatorRight:24,

    filterVerticalGridLineColor: 0xcccccc,
    filterVerticalGridLines:false,
    filterVerticalGridLineThickness:1,

    filterHorizontalGridLineColor: 0xcccccc,
    filterHorizontalGridLines:true,
    filterHorizontalGridLineThickness:1,
    filterDrawTopBorder:false,

    footerVerticalGridLineColor: 0xcccccc,
    footerVerticalGridLines:false,
    footerVerticalGridLineThickness:1,

    footerHorizontalGridLineColor: 0xcccccc,
    footerHorizontalGridLines:false,
    footerHorizontalGridLineThickness:1,
    footerDrawTopBorder:false,

    pagerVerticalGridLineColor: 0xcccccc,
    pagerVerticalGridLines:false,
    pagerVerticalGridLineThickness:1,

    pagerHorizontalGridLineColor: 0xcccccc,
    pagerHorizontalGridLines:true,
    pagerHorizontalGridLineThickness:1,


    rendererVerticalGridLineColor: 0xcccccc,
    rendererVerticalGridLines:false,
    rendererVerticalGridLineThickness:1,

    rendererHorizontalGridLineColor: 0xcccccc,
    rendererHorizontalGridLines:true,
    rendererHorizontalGridLineThickness:1,
    rendererDrawTopBorder:false,

    rollOverColor: 0xF5F5F5,

    headerRollOverColors:  [0xF5F5F5, 0xF5F5F5],
    headerColors:  [0xFFFFFF, 0xFFFFFF],

    columnGroupRollOverColors:  [0xF5F5F5, 0xF5F5F5],
    columnGroupColors:  [0xFFFFFF, 0xFFFFFF],

    footerRollOverColors:  [0xF5F5F5, 0xF5F5F5],
    footerColors:  [0xFFFFFF, 0xFFFFFF],

    fixedColumnFillColors:  [0xBFBFBF,0xBFBFBF],

    filterRollOverColors:  [0xF5F5F5, 0xF5F5F5],
    filterColors:  [0xFFFFFF, 0xFFFFFF],

    activeCellColor: 0xdddddd,

    pagerRollOverColors:  [0xF5F5F5, 0xF5F5F5],
    pagerColors:  [0xFFFFFF, 0xFFFFFF],

    rendererRollOverColors:  [0xF5F5F5, 0xF5F5F5],
    rendererColors:   [0xFFFFFF,0xFFFFFF],

    lockedSeperatorColor: 0xcccccc,
    lockedSeperatorThickness: 2,

    dropIndicatorColor: 0x000000,
    dropIndicatorThickness: 2,

    textSelectedColor:0x000000,
    textRollOverColor:0x000000,
    selectionDisabledColor: null,
    selectionDisabledTextColor:0xDDDDDD,

    disclosureClosedIcon: "/expand.png",
    disclosureOpenIcon: "/collapse.png",
    sortArrowSkin: "/sortArrow.png",

    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 2,

    rowHeight:48,

    columnGroupRowHeight : 48 ,
    

    headerPaddingBottom: 2,
    headerPaddingLeft: 2,
    headerPaddingRight: 2,
    headerPaddingTop: 2,
    headerRowHeight : 48 ,
    
    filterPaddingBottom: 2,
    filterPaddingLeft: 2,
    filterPaddingRight: 2,
    filterPaddingTop: 2,
    filterRowHeight : 48 ,
    

    footerPaddingBottom: 2,
    footerPaddingLeft: 2,
    footerPaddingRight: 2,
    footerPaddingTop: 2,
    footerRowHeight : 48 ,
    
    pagerPaddingBottom: 0,
    pagerPaddingLeft: 0,
    pagerPaddingRight: 0,
    pagerPaddingTop: 0,
    pagerRowHeight : 48 ,
    rendererPaddingBottom: 2,
    rendererPaddingLeft: 2,
    rendererPaddingRight: 2,
    rendererPaddingTop: 2,

    borderSides:"left,right,top,bottom",
    borderThickness:1,
    borderColor: 0xcccccc,

    headerStyleName:"dataGridStyles",
    footerStyleName:"dataGridStyles",
    pagerStyleName:"",
    columnGroupStyleName:"columnGroupStyle",
    columnGroupClosedIcon: "/expand.png",
    columnGroupOpenIcon: "/collapse.png",

    multiColumnSortNumberStyleName:"multiColumnSortNumberStyle",
    multiColumnSortNumberHeight:15,
    multiColumnSortNumberWidth:15,
    selectionColor: 0xEEEEEE,
    selectionDuration: 250,
    headerSortSeparatorColor:0xCCCCCC,

    checkIconClass: '/checkGreen.png',
    crossIconClass: '/notAvailable.png'
};






class App extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return <Demo />;

    }
}
ReactDOM.render(<App />, document.getElementById('app'));
