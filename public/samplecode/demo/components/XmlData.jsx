import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

export default class XmlData extends React.Component {
  constructor() {
    super();
  }

  /**
   *
   * @param item
   * @param dgColumn
   * @return {*|The}
   */
  dataGridFormatDateLabelFunction(item, dgColumn) {

    var num = UIUtils.resolveExpression(item, dgColumn.dataField);
    var date = UIUtils.stringToDate(num, "YYYY-MM-DD");
    return UIUtils.formatDate(date);

  };
  /**
   *
   * @param item
   * @param col
   * @return {*}
   */
  convertDate(item, col) {

    var dt = UIUtils.resolveExpression(item, col.getDataField()).toString();
    var date = UIUtils.stringToDate(dt, "YYYY-MM-DD");
    return date;

  };


  componentDidMount() {
    const grid = this.grid;
    const json = UIUtils.xml2json(dpXML);
    grid.setDataProvider(json.book);
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Flat XML Data</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid  width={"100%"}  ref={(grid) => { this.grid = grid; }} enablePrint enablePreferencePersistence enableExport enableCopy enableFilters enableFooters initialSortField="title"
            initialSortAscending forcePagerRow variableRowHeight>
            <ReactDataGridColumn dataField="id" headerText="ID" filterControl="TextInput" filterOperation="Contains" columnWidthMode="fitToContent" />
            <ReactDataGridColumn dataField="title" headerText="Title" filterControl="TextInput" columnWidthMode="fitToContent"
             footerLabel="Count:" footerOperation="count" footerAlign="center" filterOperation="Contains" />
            <ReactDataGridColumn dataField="genre" headerText="Genre" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid columnWidthMode="fitToContent" />
            <ReactDataGridColumn dataField="price" headerText="Price" filterControl="NumericRangeBox" columnWidthMode="fixed" width="100" footerLabel="Avg:"
             footerOperation="average" footerAlign="center" footerOperationPrecision="2" footerFormatter={flexiciousNmsp.CurrencyFormatter} 
             labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} />
            <ReactDataGridColumn dataField="publish_date" headerText="Publish Date" filterControl="DateComboBox" columnWidthMode="fitToContent"
               filterConverterFunction={this.convertDate} labelFunction={this.dataGridFormatDateLabelFunction} />
            <ReactDataGridColumn dataField="description" headerText="Description" wordWrap />
          </ReactDataGrid>


        </FullWidthSection>
      </div>
    );
  }
}
const dpXML = '<root>' +
  '   <book>' +
  '       <id>bk101</id>' +
  '       <author>Gambardella, Matthew</author>' +
  '       <title>XML Developers Guide</title>  ' +
  '       <genre>Computer</genre>' +
  '       <price>44.95</price>' +
  '       <publish_date>2011-10-01</publish_date>' +
  '       <description>An in-depth look at creating applications with XML</description>' +
  '   </book>' +
  '   <book>' +
  '       <id>bk102</id>' +
  '       <author>Ralls, Kim</author>' +
  '       <title>Midnight Rain</title>' +
  '       <genre>Fantasy</genre>' +
  '       <price>5.95</price>' +
  '       <publish_date>2011-12-16</publish_date>' +
  '       <description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen  of the world.</description>' +
  '   </book>' +
  '   <book>' +
  '       <id>bk103</id>' +
  '       <author>Corets, Eva</author>' +
  '       <title>Maeve Ascendant</title>' +
  '       <genre>Fantasy</genre>' +
  '       <price>5.95</price>' +
  '       <publish_date>2011-11-17</publish_date>' +
  '       <description>After the collapse of a nanotechnology society in England, the young survivors lay the foundation for a new society.</description>' +
  '   </book>' +
  '   <book>' +
  '       <id>bk104</id>' +
  '       <author>Corets, Eva</author>' +
  '       <title>Oberons Legacy</title>' +
  '       <genre>Fantasy</genre>' +
  '       <price>5.95</price>' +
  '       <publish_date>2011-03-10</publish_date>' +
  '       <description>In post-apocalypse England, the mysterious agent known only as Oberon helps to create a new life for the inhabitants of London. Sequel to Maeve Ascendant.</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk105</id><id>bk105</id>' +
  '       <author>Corets, Eva</author>' +
  '       <title>The Sundered Grail</title>' +
  '       <genre>Fantasy</genre>' +
  '       <price>5.95</price>' +
  '       <publish_date>2011-09-10</publish_date>' +
  '       <description>The two daughters of Maeve, half-sisters, battle one another for control of England. Sequel to Oberons Legacy.</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk106</id>' +
  '       <author>Randall, Cynthia</author>' +
  '       <title>Lover Birds</title>' +
  '       <genre>Romance</genre>' +
  '       <price>4.95</price>' +
  '       <publish_date>2011-09-02</publish_date>' +
  '       <description>When Carla meets Paul at an ornithology conference, tempers fly as feathers get ruffled</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk107</id>' +
  '       <author>Thurman, Paula</author>' +
  '       <title>Splish Splash</title>' +
  '       <genre>Romance</genre>' +
  '       <price>4.95</price>' +
  '       <publish_date>2011-11-02</publish_date>' +
  '       <description>A deep sea diver finds true love twenty thousand leagues beneath the sea</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk108</id>' +
  '       <author>Knorr, Stefan</author>' +
  '       <title>Creepy Crawlies</title>' +
  '       <genre>Horror</genre>' +
  '       <price>4.95</price>' +
  '       <publish_date>2011-12-06</publish_date>' +
  '       <description>An anthology of horror stories about roaches, centipedes, scorpions  and other insects</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk109</id>' +
  '       <author>Kress, Peter</author>' +
  '       <title>Paradox Lost</title>' +
  '       <genre>Science Fiction</genre>' +
  '       <price>6.95</price>' +
  '       <publish_date>2011-11-02</publish_date>' +
  '       <description>After an inadvertant trip through a Heisenberg Uncertainty Device, James Salway discovers the problems of being quantum</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk110</id>' +
  '       <author>OBrien, Tim</author>' +
  '       <title>Microsoft NET: The Programming Bible</title>' +
  '       <genre>Computer</genre>' +
  '       <price>36.95</price>' +
  '       <publish_date>2011-12-09</publish_date>' +
  '       <description>Microsofts NET initiative is explored in detail in this deep programmers reference</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk111</id>' +
  '       <author>OBrien, Tim</author>' +
  '       <title>MSXML3: A Comprehensive Guide</title>' +
  '       <genre>Computer</genre>' +
  '       <price>36.95</price>' +
  '       <publish_date>2011-12-01</publish_date>' +
  '        <description>The Microsoft MSXML3 parser is covered in detail, with attention to XML DOM interfaces, XSLT processing, SAX and more</description>' +
  '   </book>' +
  '   <book >' +
  '       <id>bk112</id>' +
  '       <author>Galos, Mike</author>' +
  '       <title>Visual Studio 7: A Comprehensive Guide</title>' +
  '       <genre>Computer</genre>' +
  '       <price>49.95</price>' +
  '       <publish_date>2011-04-16</publish_date>' +
  '       <description>Microsoft Visual Studio 7 is explored in depth, looking at how Visual Basic, Visual C++, C, and ASP+ are integrated into a comprehensive development environment</description>' +
  '   </book>' +
  '</root>';



