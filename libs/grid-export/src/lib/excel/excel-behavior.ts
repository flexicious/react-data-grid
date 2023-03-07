import { Behaviors, ColumnOptions, ExcelBehavior, ExcelBehaviorOptions, GridOptions, itemToLabel } from "@euxdt/grid-core";

import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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




// In case you are using xlsx already, you can use it the below code to export to excel
// import * as XLSX from 'xlsx';


// export const createExcelBehavior = (options: ExcelBehaviorOptions) => (gridOptions: GridOptions): ExcelBehavior => {
//     const exportToExcel = (rowPositions: unknown[], colPositions: ColumnOptions[]): void => {
//         let excelColumns = colPositions.filter(column => column.excludeFromExcel !== true)
//         const key = (c: ColumnOptions) => c.headerText || c.dataField || c.uniqueIdentifier;
//         const headers = excelColumns.map(column => key(column));
//         //make data as an array of objects with column keys as properties
//         const data = rowPositions.map(row => excelColumns.reduce((acc, column) => {
//             acc[key(column)] = itemToLabel(row, column);
//             return acc;
//         }, {} as any));

//         const workbook = XLSX.utils.book_new();


//         const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

//         // adding heading to the first row of the created sheet.
//         XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

//         // appending sheet with a name
//         XLSX.utils.book_append_sheet(workbook, ws, 'Export');

//         // Generate an .xlsx file from the workbook
//         const file = new Blob([XLSX.write(workbook, { type: 'array' })]);
//         // Download the file
//         XLSX.writeFile(workbook, "export.xlsx", { compression: true });
//     }

//     return {
//         behaviorName: Behaviors.ExcelBehavior,
//         options: {},
//         exportToExcel
//     }
// }

