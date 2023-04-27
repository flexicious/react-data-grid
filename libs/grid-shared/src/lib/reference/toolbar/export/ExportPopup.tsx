import { findBehavior, Behaviors, Box, ExcelBehavior, FilterPageSortLoadMode, getApi, getRectFromDom, GridIconButton, GRID_CONSTANTS, PdfBehavior, RendererProps } from "@ezgrid/grid-core";
import { FC, useState } from "react";
import { Popup, PopupButton } from "../../shared/PopupButton";
import { buttonCreator } from "../../shared/shared-props";
import { ColumnPicker } from "./ColumnPicker";

export interface ExportPopupProps extends RendererProps {
    exportType: "pdf" | "excel";
}
export const ExportPopup: FC<ExportPopupProps> = ({ node, exportType }) => {
    const [exportVisible, setExportVisible] = useState(false);
    const [rectangle, setRectangle] = useState<Box>();
    const pagingEnabled = node.gridOptions.enablePaging;
    const serverMode = node.gridOptions.filterPageSortMode === FilterPageSortLoadMode.Server;
    const api = getApi(node);
    const pdfBehavior = findBehavior(node.gridOptions, Behaviors.PdfBehavior) as PdfBehavior;
    const excelBehavior = findBehavior(node.gridOptions, Behaviors.ExcelBehavior) as ExcelBehavior;
    const maxRows = (exportType === "pdf" ? pdfBehavior?.options.maxRows : excelBehavior?.options.maxRows) ?? GRID_CONSTANTS.MAX_EXPORT_ROWS;
    const batchSize = (exportType === "pdf" ? pdfBehavior?.options.batchSize : excelBehavior?.options.batchSize) ?? GRID_CONSTANTS.EXPORT_BATCH_SIZE;
    const totalRows = node.gridOptions.serverInfo?.pagination?.totalRecords;
    const dataRequest = api.dispatchExportPageRequested;
    const setBoundingRect = () => {
        const rect = getRectFromDom(api.getGridBox(true));
        if (rect) {
            setRectangle({ ...rect, width: undefined });
        }
    };
    return <div className="ezgrid-dg-toolbar-section">
        <PopupButton node={node} popupVisible={exportVisible} setPopupVisible={setExportVisible}
            trigger={exportType === "pdf" ? buttonCreator(node, "export-pdf-icon", "Export To Pdf", setBoundingRect, GridIconButton.Pdf) :
                buttonCreator(node, "export-excel-icon", "Export To Excel", setBoundingRect, GridIconButton.Excel)
            }
        />
        {exportVisible && <Popup node={node} rectangle={rectangle} setPopupVisible={setExportVisible}>
            <ColumnPicker node={node} setPopupVisible={setExportVisible} exportType={exportType} pdfColumnLimit={pdfBehavior?.options.maxColumns} 
            pagingEnabled={pagingEnabled} serverMode={serverMode} maxRows={maxRows} batchSize={batchSize} totalRows={totalRows} dataRequest={dataRequest}
            />
        </Popup>
        }
    </div>;
};
