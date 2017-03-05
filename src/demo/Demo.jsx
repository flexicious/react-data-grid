import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/Layout';
import Simple from './components/Simple';
import Nested from './components/Nested';
import Grouped from './components/Grouped';
import Grouped2 from './components/Grouped2';
import Outlook from './components/Outlook';
import ItemRenderer from './components/ItemRenderer';
import ColumnLockMode from './components/ColumnLockMode';
import PartialLazyLoad from './components/PartialLazyLoad';
import LevelRenderer from './components/LevelRenderer';
import ItemEditor from './components/ItemEditor';
import ProgramaticCellFormatting from './components/ProgramaticCellFormatting';
import FullLazyLoad from './components/FullLazyLoad';
import DynamicColumns from './components/DynamicColumns';
import LargeDataset from './components/LargeDataset';
import XmlData from './components/XmlData';
import XmlGroupedData from './components/XmlGroupedData';
import AutoResizingGrid from './components/AutoResizingGrid';
import SelectionModes from './components/SelectionModes';
import CustomMatchFilterControl from './components/CustomMatchFilterControl';
import CustomToolbar from './components/CustomToolbar';
import LargeDynamicGrid from './components/LargeDynamicGrid';
import DynamicLevels from './components/DynamicLevels'

import IconColumns from './components/IconColumns'
import ErrorHandling from './components/ErrorHandling'
import DynamicGrouping from './components/DynamicGrouping'
import SelectionUI1 from './components/SelectionUI1'
import SelectionUI2 from './components/SelectionUI2'
import ExternalFilter from './components/ExternalFilter'
import ChangeTrackingAPI from './components/ChangeTrackingAPI'
import RowSpanColSpan from './components/RowSpanColSpan'
import TraderView from './components/TraderView'
import VariableRowHeight from './components/VariableRowHeight'
import SelectionOptions from './components/SelectionOptions'
import FilterComboBoxDataProvider from './components/FilterComboBoxDataProvider'
import Localization from './components/Localization'
import OnlyOneItemOpen from './components/OnlyOneItemOpen'
import SortNumeric from './components/SortNumeric'
import MultiSelectSetFilterValue from './components/MultiSelectSetFilterValue'
import VariableHeaderRowHeight from './components/VariableHeaderRowHeight'
import MultipleGroupingManual from './components/MultipleGroupingManual'
import CustomFooter from './components/CustomFooter'
import ColumnWidthMode from './components/ColumnWidthMode'
import DynamicColumnGroups from './components/DynamicColumnGroups'
import FlexiciousMockGenerator from './mockdata/FlexiciousMockGenerator.js'

import { Router, Route, browserHistory, hashHistory } from 'react-router';
import 'babel-polyfill';


FlexiciousMockGenerator.instance().init()
const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Simple },
  childRoutes: [
    { path: 'simple', component: Simple },
    { path: 'nested', component: Nested },
    { path: 'grouped', component: Grouped },
    { path: 'grouped2', component: Grouped2 },
    { path: 'outlook', component: Outlook },
    { path: 'itemrenderer', component: ItemRenderer },
    { path: 'columnlockmode', component: ColumnLockMode },
    { path: 'partiallazyload', component: PartialLazyLoad },
    { path: 'levelrenderer', component: LevelRenderer },
    { path: 'fulllazyload', component: FullLazyLoad },
    { path: 'programaticcellformatting', component: ProgramaticCellFormatting },
    { path: 'itemeditor', component: ItemEditor },
    { path: 'dynamiccolumns', component: DynamicColumns },
    { path: 'largedataset', component: LargeDataset },
    { path: 'xmldata', component: XmlData },
    { path: 'xmlgroupeddata', component: XmlGroupedData },
    { path: 'autoresizinggrid', component: AutoResizingGrid },
    { path: 'selectionmodes', component: SelectionModes },
    { path: 'custommatchfiltercontrol', component: CustomMatchFilterControl },
    { path: 'customtoolbar', component: CustomToolbar },
    { path: 'largedynamicgrid', component: LargeDynamicGrid },
    { path: 'dynamiclevels', component: DynamicLevels },


    { path: 'iconcolumns', component: IconColumns },
    { path: 'errorhandling', component: ErrorHandling },
    { path: 'dynamicgrouping', component: DynamicGrouping },
    { path: 'selectionui1', component: SelectionUI1 },
    { path: 'selectionui2', component: SelectionUI2 },
    { path: 'externalfilter', component: ExternalFilter },
    { path: 'changetrackingapi', component: ChangeTrackingAPI },
    { path: 'rowspancolspan', component: RowSpanColSpan },
    { path: 'traderview', component: TraderView },
    { path: 'variablerowheight', component: VariableRowHeight },
    { path: 'selectionoptions', component: SelectionOptions },
    { path: 'filtercomboboxdataprovider', component: FilterComboBoxDataProvider },
    { path: 'localization', component: Localization },
    { path: 'oneitemopen', component: OnlyOneItemOpen },
    { path: 'sortnumeric', component: SortNumeric },
    { path: 'multiselectsetfiltervalue', component: MultiSelectSetFilterValue },
    { path: 'variableheaderrowheight', component: VariableHeaderRowHeight },
    { path: 'multiplegroupingmanual', component: MultipleGroupingManual },
    { path: 'customfooter', component: CustomFooter },
    { path: 'dynamiccolumngroups', component: DynamicColumnGroups },
    { path: 'columnwidthmode', component: ColumnWidthMode }
  ]
};

const Demo = () => {

  return (
    <Router history={hashHistory} routes={routes} />
  );
}

export default Demo;

