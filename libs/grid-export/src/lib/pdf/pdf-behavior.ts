import { Behaviors, ColumnOptions, GridOptions, itemToLabel, PdfBehavior, PdfBehaviorOptions } from "@ezgrid/grid-core";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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

