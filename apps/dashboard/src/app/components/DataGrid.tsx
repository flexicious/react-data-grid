
import { useTheme } from "@mui/material";
import * as ExcelJS from "exceljs";
import pkg from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReactDataGridOptions, ReactDataGrid, getEditOptions, getFilterOptions, createMultiSelectFilterOptions, createSelectEditorOptions } from "@ezgrid/grid-react";
import { createFilterBehavior, createEditBehavior, GridOptions, ColumnOptions, PdfBehavior, PdfBehaviorOptions, itemToLabel, Behaviors, ExcelBehavior, ExcelBehaviorOptions, createColumn, resolveExpression } from "@ezgrid/grid-core";
const { saveAs } = pkg;



interface DataGridProps<T=unknown> extends ReactDataGridOptions<T> {
    editorHandlesTabEnter?: boolean;
    reduceFilterDropdowns?: boolean;
}
export const DataGrid = <T=unknown>(props: DataGridProps<T>) => {
    const theme = useTheme();
    const cellsBeforeBody = [["Company:", "ABC Corp"], ["Date", new Date().toLocaleDateString()], [], []];
    const cellsAfterBody = [[], [], ["Disclaimer"], [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales eleifend eros, sit amet bibendum enim venenatis at. Aliquam erat volutpat. Ut interdum velit vel enim sodales pulvinar. Suspendisse vehicula elit eget sapien malesuada, quis luctus dolor semper. Mauris tincidunt tellus ante, quis ornare purus rutrum in. Proin rhoncus mauris in tortor porttitor mattis. Aenean auctor hendrerit vulputate. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed sit amet pulvinar urna.

    Fusce mattis magna ut sem eleifend, ac facilisis massa maximus. Nunc pulvinar convallis sodales. Quisque condimentum venenatis elit mollis viverra. Maecenas id libero imperdiet, mollis dolor et, sollicitudin odio. Duis efficitur commodo mattis. Duis id nibh ligula. Maecenas ut dignissim ante. Nulla eu diam lacus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc sit amet sapien non quam feugiat dignissim vel sit amet mi. Proin ac massa sapien. Nulla est arcu, molestie sit amet dui quis, ullamcorper interdum justo. Duis pharetra eros diam, eu ornare nibh scelerisque ut. Pellentesque non metus sit amet ligula commodo auctor sit amet in odio. Pellentesque ac enim ligula. Phasellus eu nibh id justo posuere pellentesque.
    
    In non venenatis tellus, vitae accumsan neque. Aenean a libero lacus. Aenean a lorem fringilla, blandit odio a, ornare mauris. Nulla in tincidunt nibh. Sed libero massa, vestibulum et hendrerit et, egestas sed enim. Proin eu mauris vehicula, semper felis eget, consequat erat. Suspendisse eleifend sapien diam, eu condimentum felis faucibus ut. Phasellus ullamcorper ligula in enim porta, non laoreet lacus ultrices. Nunc ac tortor lorem. Nam ornare ex sit amet massa aliquet facilisis.
    
    Nullam aliquam hendrerit enim. In ultrices efficitur sem. Ut malesuada leo et tellus porttitor gravida. In elementum turpis sit amet ornare ultrices. Nam turpis massa, fringilla rhoncus maximus in, consequat sed orci. Phasellus rutrum sapien id facilisis auctor. Integer venenatis sem et urna condimentum ultrices. In nec ligula ut justo pellentesque pulvinar. Curabitur eleifend egestas dolor, eu aliquet risus eleifend vel.
    
    Nullam venenatis purus sit amet tempus vehicula. Morbi orci mauris, egestas eu iaculis viverra, rhoncus sed libero. Praesent in felis vitae risus eleifend vehicula. In finibus elit vitae purus hendrerit faucibus. In varius, quam ac tristique dapibus, est risus luctus tellus, dapibus iaculis metus lorem nec nisl. Morbi et dictum orci. Pellentesque et libero metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam blandit cursus risus, vel aliquam lorem varius vel. Proin ullamcorper nibh eros, in blandit ipsum rutrum eu. Sed sit amet neque at mi sagittis pellentesque luctus ut ipsum. Fusce ullamcorper quam sit amet tincidunt imperdiet. Mauris diam lorem, vulputate a dapibus sed, dictum rhoncus sem. Fusce congue volutpat sapien vitae lacinia.
    
    `]];
    const { gridOptions, style, ref, editorHandlesTabEnter,reduceFilterDropdowns, ...rest } = props;
    const newProps = {
        ...rest,
        gridOptions: {
            ...gridOptions,
            behaviors: [createFilterBehavior({reduceFilterDropdowns}),
            createPdfBehavior({ cellsBeforeBody, cellsAfterBody }),
            createExcelBehavior({ cellsBeforeBody, cellsAfterBody }),
            createEditBehavior({ editorHandlesTabEnter })
            ]
        },
        style: { ...style, minHeight: "500px" },
    };
    return <ReactDataGrid {...newProps} ref={ref as any} />;
};

export const getTemplateColumn=(c: ColumnOptions,distinctValueColumns:string[],columnOverrides:ColumnOptions[]=[])  =>{
    if (typeof c.format === "string") {
        c.filterOptions = getFilterOptions({ type: c.format });
        if (distinctValueColumns.indexOf(c.dataField) > -1) {
            c.filterOptions = createMultiSelectFilterOptions();
            c.editOptions = {
                ...createSelectEditorOptions(),
                ...c.editOptions,
            }
        }
        const overrides  = columnOverrides?.find(h => h.uniqueIdentifier === c.uniqueIdentifier);
        if (overrides) {
            Object.keys(overrides).forEach(k => {
                if(resolveExpression(overrides,k) !== undefined)
                    resolveExpression(c,k,resolveExpression(overrides,k));
            });
        }
    }
    let result = c;
    if(typeof c.format === "string") {
      result = {
        ...c,
        ...createColumn(c.dataField, c.format, c.headerText, c.uniqueIdentifier)
      };
      if(c.editOptions?.enableEdit)
        result.editOptions = {
            ...getEditOptions({type: c.format}),
            ...c.editOptions
        };
    }
    return result;
  }

export const createPdfBehavior = (options: PdfBehaviorOptions) => (gridOptions: GridOptions): PdfBehavior => {
    const exportToPdf = (rowPositions: unknown[], colPositions: ColumnOptions[], orientation: "landscape" | "portrait"): void => {
        const doc = new jsPDF({
            orientation
        });
        const beforeTable = options.cellsBeforeBody || [];
        let ySofar = 0;
        const addLine = (line: string, maxWidth = 250) => {
            doc.setFont("helvetica");
            doc.setFontSize(10);
            var splitTitle = doc.splitTextToSize(line, maxWidth);
            doc.text(splitTitle, 15, ySofar+10);
            ySofar += splitTitle.length * 10;
        };
        beforeTable.forEach((row, rowIndex) => {
            const line = row.join(" ");
            addLine(line);
        });
        let pdfColumns = colPositions.filter(column => column.excludeFromPdf !== true);
        if (options.columnsToInclude && options.columnsToInclude.length > 0) {
            pdfColumns = pdfColumns.filter(column => options.columnsToInclude!.includes(column.uniqueIdentifier));
        } else {
            //cant really fit more than 10 columns on one page
            pdfColumns = pdfColumns.slice(0, options.maxColumns || 10);
        }
        autoTable(doc, {
            startY: (beforeTable.length * 10),
            head: [pdfColumns.map(column => column.headerText)],
            body:
                rowPositions.map(row => pdfColumns.map(column => itemToLabel(row, column)))
            ,
        });
        const afterTable = options.cellsAfterBody || [];
        if (afterTable.length > 0) {
            doc.addPage();
            ySofar = 0;
            afterTable.forEach((row, rowIndex) => {
                const line = row.join(" ");
                addLine(line);
            });
        }
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
        const beforeTable = options.cellsBeforeBody || [];
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Sheet1");
        beforeTable.forEach(row => sheet.addRow(row));
        sheet.addRow(data.head[0]);
        sheet.getRow(beforeTable.length + 1).font = { size: 14, bold: true };
        sheet.getRow(beforeTable.length + 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFCCCCCC" } };
        data.body.forEach(row => sheet.addRow(row));
        options.cellsAfterBody?.forEach(row => sheet.addRow(row));

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