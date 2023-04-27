import { RendererProps } from "@ezgrid/grid-core";
import { FC } from "react";
import { ExportPopup } from "./export/ExportPopup";

export const Exporter: FC<RendererProps> = ({ node }) => {
    const enablePdf = node.gridOptions.toolbarOptions?.enablePdf;
    const enableExcel = node.gridOptions.toolbarOptions?.enableExcel;
    if (!enablePdf && !enableExcel)
        return <></>;
    return <div className="ezgrid-dg-toolbar-section"> | 
        {enablePdf && <ExportPopup node={node} exportType="pdf" />}
        {enableExcel && <ExportPopup node={node} exportType="excel" />}
    </div>;
};
