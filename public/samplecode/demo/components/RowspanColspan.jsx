import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn, ReactDataGridColumnGroup } from './LibraryImports'
import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

let questions = [];
let rbnRowSpanselected = true;
let rbnColSpanselected = false;

export default class RowspanColspan extends React.Component {
  constructor() {
    super();
    this.spanSelectHandler = this.spanSelectHandler.bind(this)
  }


  componentDidMount() {
    const grid = this.refs.grid;
    questions = [];
    this.addQuestion("Please rate your level of satisfaction with the sense of safety and security as experienced in your residential college/housing campus");
    this.addQuestion("Please rate your level of satisfaction with the availability of public transportation to and from the University Campus");
    this.addQuestion("Please rate your level of satisfaction with the quality of the Intramural sports and recreation programs");
    this.addQuestion("Please rate your level of satisfaction with your sense of acceptance, belonging, and community");
    grid.setDataProvider(questions);
    grid.validateNow();
    grid.expandAll();
  }

  addQuestion(questionText) {
    var q = new Object();
    q.question = questionText;
    q.answers = [];
    this.addAnswers(q);
    questions.push(q);
  }

  addAnswers(q) {
    q.answers.push(this.createAnswer('Very Satisfied'));
    q.answers.push(this.createAnswer('Moderately Satisfied'));
    q.answers.push(this.createAnswer('No Opinion/NA'));
    q.answers.push(this.createAnswer('Moderately Dissatisfied'));
    q.answers.push(this.createAnswer('Very Satisfied'));
    var total = flexiciousNmsp.UIUtils.sum(q.answers, "totalCount");
    for (var i = 0; i < q.answers.length; i++) {
      var a = q.answers[i];
      a.totalPercent = (100 * a.totalCount / total).toFixed(2);
    }
    q.freshmanCount = flexiciousNmsp.UIUtils.sum(q.answers, "freshmanCount");
    q.sophomoreCount = flexiciousNmsp.UIUtils.sum(q.answers, "sophomoreCount");
    q.juniorCount = flexiciousNmsp.UIUtils.sum(q.answers, "juniorCount");
    q.seniorCount = flexiciousNmsp.UIUtils.sum(q.answers, "seniorCount");

    q.totalCount = q.freshmanCount + q.sophomoreCount + q.juniorCount + q.seniorCount;
    q.freshmanPercent = (100 * q.freshmanCount / q.totalCount).toFixed(2);
    q.sophomorePercent = (100 * q.sophomoreCount / q.totalCount).toFixed(2);
    q.juniorPercent = (100 * q.juniorCount / q.totalCount).toFixed(2);
    q.seniorPercent = (100 * q.seniorCount / q.totalCount).toFixed(2);
    q.totalPercent = 100;
  }

  createAnswer(answerOption) {
    var a = new Object();
    a.answerOption = answerOption;
    a.freshmanCount = FlexiciousMockGenerator.getRandom(100, 400);
    a.sophomoreCount = FlexiciousMockGenerator.getRandom(100, 400);
    a.juniorCount = FlexiciousMockGenerator.getRandom(100, 400);
    a.seniorCount = FlexiciousMockGenerator.getRandom(100, 400);

    a.totalCount = a.freshmanCount + a.sophomoreCount + a.juniorCount + a.seniorCount;
    a.freshmanPercent = (100 * a.freshmanCount / a.totalCount).toFixed(2);
    a.sophomorePercent = (100 * a.sophomoreCount / a.totalCount).toFixed(2);
    a.juniorPercent = (100 * a.juniorCount / a.totalCount).toFixed(2);
    a.seniorPercent = (100 * a.seniorCount / a.totalCount).toFixed(2);
    return a;
  }

  getColor(cell) {
    if (cell.level.getNestDepth() == 1 //top level
      && cell.getColumn()
      && cell.getColumn().getDataField() == "question" //its the first column
      && cell.getRowInfo().getIsDataRow() //its the data row, not the header or the footer row
    )
      return 0xF7F3F7;

    return null;
  }

  getRowSpan(cell) {
    if (!rbnRowSpanselected) return 1;
    if (cell.getLevel().getNestDepth() == 1 //top level
      && cell.getLevel().isItemOpen(cell.rowInfo.getData())//item is open
      && cell.getColumn()
      && cell.getColumn().getDataField() == "question" //its the first column
      && cell.getRowInfo().getIsDataRow() //its the data row, not the header or the footer row
      && !cell.getRowInfo().getIsFillRow()//since the filler is also considered a data row
    )
      return cell.getRowInfo().getData().answers.length + 1;

    return 1;
  }

  getColSpan(cell) {
    if (!rbnColSpanselected) return 1;
    if (cell.getLevel().getNestDepth() == 1 //top level
      && cell.getColumn()
      && cell.getColumn().getDataField() == "question" //its the first column
      && cell.getRowInfo().getIsDataRow() //its the data row, not the header or the footer row
      && !cell.getRowInfo().getIsFillRow()//since the filler is also considered a data row
    )
      return cell.getGrid().getColumns().length;
    return 1;
  }

  handleRowSpanClick() {
    const grid = this.refs.grid;
    rbnRowSpanselected = true;
    rbnColSpanselected = false;
    var questionColumn = grid.getColumnByDataField('question');
    questionColumn.setColumnLockMode(flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_LEFT);
    grid.reDraw();
  }

  handleColumnSpanClick() {
    const grid = this.refs.grid;
    rbnRowSpanselected = false;
    rbnColSpanselected = true;
    var questionColumn = grid.getColumnByDataField('question');
    questionColumn.setColumnLockMode(flexiciousNmsp.FlexDataGridColumn.LOCK_MODE_NONE);
    grid.reDraw();
  }

  spanSelectHandler(evt, newValue) {
    if (newValue == "rowSpan")
      this.handleRowSpanClick();
    else
      this.handleColumnSpanClick();
  }

  render() {
    return (
      <div>
        <h1 className='page-title'>Row Span and Column Span</h1>
        <FullWidthSection useContent={true}>
          <RadioButtonGroup name="pageSelection" defaultSelected={"rowSpan"} onChange={this.spanSelectHandler}>
            <RadioButton name="useRowSpan" label={"Use Row Span"} className={"flxsExportpaging RBN_CURRENT_PAGE"} value={"rowSpan"} />
            <RadioButton name="useColumnSpan" label={"Use Column Span"} className={"flxsExportpaging RBN_ALL_PAGES"} value={"columnSpan"} />
          </RadioButtonGroup>
          <ReactDataGrid width={"100%"} fontFamily="tahoma" horizontalScrollPolicy={"off"} fontSize="11" ref="grid" enableDynamicLevels rowSpanFunction={this.getRowSpan.bind(this)} colSpanFunction={this.getColSpan.bind(this)}
            enableDefaultDisclosureIcon={false} preferencePersistenceKey="rowSpanColSpan" cellBackgroundColorFunction={this.getColor} horizontalGridLines alternatingItemColors={[0xFFFFFF, 0xE7F3FF]} headerColors={[0x298EBD, 0x298EBD]}
            headerRollOverColors={[0x298EBD, 0x298EBD]} columnGroupColors={[0x298EBD, 0x298EBD]} footerColors={[0x298EBD, 0x298EBD]} headerStyleName="whiteText" footerStyleName="whiteText" columnGroupStyleName="whiteText" footerRollOverColors={[0x298EBD, 0x298EBD]} lockedSeperatorThickness={1} lockedSeperatorColor="0x6f6f6f" >
            <ReactDataGridColumnLevel childrenField="answers" enableFooters >
              <ReactDataGridColumn columnTextColor="0x17365D" id="questionColumn" width="200" columnWidthMode="fixed" headerText="Survey Question" dataField="question" wordWrap enableExpandCollapseIcon paddingLeft={20} expandCollapseIconTop={4} expandCollapseIconLeft={4} />
              <ReactDataGridColumn width="150" headerText="Answer" dataField="answerOption" />
              <ReactDataGridColumnGroup headerText="Freshman">
                <ReactDataGridColumn dataField="freshmanCount" headerText="Count" footerOperation="sum" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
                <ReactDataGridColumn dataField="freshmanPercent" headerText="Percent" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnGroup headerText="Sophomore">
                <ReactDataGridColumn dataField="sophomoreCount" headerText="Count" footerOperation="sum" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
                <ReactDataGridColumn dataField="sophomorePercent" headerText="Percent" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnGroup headerText="Junior">
                <ReactDataGridColumn dataField="juniorCount" headerText="Count" footerOperation="sum" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
                <ReactDataGridColumn dataField="juniorPercent" headerText="Percent" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnGroup headerText="Senior">
                <ReactDataGridColumn dataField="seniorCount" headerText="Count" footerOperation="sum" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
                <ReactDataGridColumn dataField="seniorPercent" headerText="Percent" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
              </ReactDataGridColumnGroup>
              <ReactDataGridColumnGroup headerText="Total">
                <ReactDataGridColumn dataField="totalCount" headerText="Count" footerOperation="sum" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
                <ReactDataGridColumn dataField="totalPercent" headerText="Percent" footerOperationPrecision="0" textAlign="right" headerAlign="right" headerAlign="right" footerAlign="right" paddingRight={5} />
              </ReactDataGridColumnGroup>
            </ReactDataGridColumnLevel>
          </ReactDataGrid>
        </FullWidthSection>
      </div>
    );
  }
}


