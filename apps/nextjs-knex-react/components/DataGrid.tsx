import "@euxdt/grid-core/icons.css";
import "@euxdt/grid-core/styles.css";
import { useTheme } from "@mui/material";
import { materialAdapter, materialNodePropsFunction } from "@euxdt/grid-shared";
import * as ExcelJS from "exceljs";
import pkg from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReactDataGridOptions, ReactDataGrid } from "@euxdt/grid-react";
import {createFilterBehavior, createEditBehavior,  GridOptions, ColumnOptions, PdfBehavior, PdfBehaviorOptions, itemToLabel, Behaviors, ExcelBehavior, ExcelBehaviorOptions} from "@euxdt/grid-core";
const { saveAs } = pkg;



interface DataGridProps extends ReactDataGridOptions {
  editorHandlesTabEnter?: boolean;
}
export const DataGrid = (props: DataGridProps) => {
  const theme = useTheme();
  const { gridOptions, style, ref, editorHandlesTabEnter, ...rest } = props;
  const newProps = {
    ...rest,
    gridOptions: {
      ...gridOptions,
      behaviors: [createFilterBehavior({}),

      createPdfBehavior({}),
      createExcelBehavior({}),
      createEditBehavior({ applyEditsToDataProviderImmediately: true, editorHandlesTabEnter })
      ],
      adapter: materialAdapter,
      nodePropsFunction: materialNodePropsFunction(theme),
    },
    style: { ...style, minHeight: "500px" },
  };
  return <ReactDataGrid {...newProps} ref={ref as any} />;
};



export const createPdfBehavior = (options: PdfBehaviorOptions) => (gridOptions: GridOptions): PdfBehavior => {
    const exportToPdf = (rowPositions: unknown[], colPositions: ColumnOptions[], orientation: "landscape" | "portrait"): void => {
        const doc = new jsPDF({
            orientation
        });
        let pdfColumns = colPositions.filter(column => column.excludeFromPdf !== true);
        if (options.columnsToInclude && options.columnsToInclude.length > 0) {
            pdfColumns = pdfColumns.filter(column => options.columnsToInclude!.includes(column.uniqueIdentifier));
        } else {
            //cant really fit more than 10 columns on one page
            pdfColumns = pdfColumns.slice(0, options.maxColumns || 10);
        }
        autoTable(doc, {
            head: [pdfColumns.map(column => column.headerText)],
            body:
                rowPositions.map(row => pdfColumns.map(column => itemToLabel(row, column)))
            ,
        });
        doc.save("table.pdf");
    };

    return {
        behaviorName: Behaviors.PdfBehavior,
        options,
        exportToPdf
    };
};


export const createExcelBehavior = (options: ExcelBehaviorOptions) => (gridOptions: GridOptions): ExcelBehavior => {
    const exportToExcel = (rowPositions: unknown[], colPositions: ColumnOptions[]): void => {
        let excelColumns = colPositions.filter(column => column.excludeFromExcel !== true);
        const data = {
            head: [excelColumns.map(column => column.headerText)],
            body:
                rowPositions.map(row => excelColumns.map(column => itemToLabel(row, column)))
            ,
        };
        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Sheet1");

        sheet.addRow(data.head[0]);
        sheet.getRow(1).font = { size: 14, bold: true };
        sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCCCCC" } };

        data.body.forEach(row => sheet.addRow(row));

        workbook.xlsx.writeBuffer()
            .then(function (buf) {
                saveAs(new Blob([buf]), "export.xlsx");

            });

    };

    return {
        behaviorName: Behaviors.ExcelBehavior,
        options,
        exportToExcel
    };
};


