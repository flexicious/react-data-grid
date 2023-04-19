import { ApiContext, ColumnOptions, createColumn, ExportPageOption, getApi, getFlatColumns, gridCSSPrefix, GridIconButton, PdfOrientation, RendererProps, stopPropagation } from "@euxdt/grid-core";
import { FC, useEffect, useRef, useState } from "react";
import { createSelectField } from "../../adapter";
import { ReactDataGrid } from "../../ReactDataGrid";
import { buttonCreator, COL_PROPS, GRID_PROPS } from "../../shared/shared-props";

interface ColumnPickerProps extends RendererProps {
    setPopupVisible: (visible: boolean) => void;
    exportType: "pdf" | "excel";
    pdfColumnLimit?: number;
    pagingEnabled?: boolean;
    serverMode?: boolean;
    maxRows?: number;
    batchSize?: number;
    totalRows?: number;
    dataRequest?: (pageIndex: number, pageSize: number) => Promise<unknown[]>;
}
export const ColumnPicker: FC<ColumnPickerProps> = ({ node, setPopupVisible, exportType, pdfColumnLimit,
    pagingEnabled, serverMode, totalRows, maxRows, batchSize, dataRequest }) => {
    const apiRef = useRef<ApiContext | null>(null);
    const [pageOption, setPageOption] = useState<ExportPageOption>("current");
    const [orientationOption, setOrientationOption] = useState<PdfOrientation>("landscape");
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const api = getApi(node);
    const [dataProvider, setDataProvider] = useState<ColumnOptions[]>([]);
    const gridOptions = node.gridOptions;
    useEffect(() => {
        const flatCols = getFlatColumns(gridOptions.columns || [], null).filter((c) => !c.hidden &&
            exportType === "pdf" ? c.excludeFromPdf !== true : c.excludeFromExcel !== true);
        setDataProvider(flatCols);
        setTimeout(() => {
            const colsToSelect = exportType === "pdf" ? flatCols.slice(0, Math.min(flatCols.length, (pdfColumnLimit || 10))) : flatCols;
            const colsToSelectIds = colsToSelect.map((c) => c.uniqueIdentifier);
            apiRef.current?.api?.setSelectedRows(colsToSelectIds);
        }, 100);
    }, []);
    const doExport = async () => {
        const dataToExport = [];
        if (pageOption === "all" && serverMode && dataRequest) {
            if (totalRows && maxRows && batchSize) {
                if (totalRows > maxRows) {
                    alert(`Total rows ${totalRows} exceeds max rows ${maxRows}, only ${maxRows} rows will be exported`);
                }
                const totalBatches = Math.ceil(totalRows / batchSize);
                for (let i = 1; i < totalBatches + 1; i++) {
                    setLoadingMessage(`Exporting batch ${i} of ${totalBatches + 1}`);
                    dataToExport.push(...await dataRequest(i, batchSize));
                    if (i === totalBatches) {
                        setLoadingMessage("");
                    }
                    else if (maxRows && i * batchSize > maxRows) {
                        setLoadingMessage("");
                        break;
                    }
                }
            }
        }
        const selectedCols = dataProvider.filter((c) => (apiRef.current?.api?.getSelectedRows() || []).indexOf(c.uniqueIdentifier) >= 0);
        if (exportType === "pdf") {
            api.exportToPdf(dataToExport, selectedCols as ColumnOptions[], orientationOption, pageOption);
        } else {
            api.exportToExcel(dataToExport, selectedCols as ColumnOptions[], pageOption);
        }
    };
    return <>
        <ReactDataGrid style={{ width: "350px", height: "100%" }} gridOptions={{
            dataProvider,
            eventBus: {
                onApiContextReady: (ctx) => {
                    apiRef.current = ctx;
                }
            },
            ...GRID_PROPS(node, "uniqueIdentifier"),
            enableToolbar: true,
            loadingMessage,
            isLoading: loadingMessage !== "",
            toolbarOptions: {
                toolbarRenderer: ({ node }) => {
                    const { box, styles } = node;
                    return <div key={node.key} className={gridCSSPrefix("toolbar")}
                        style={{ ...box, ...styles }} onMouseEnter={stopPropagation} onMouseLeave={stopPropagation} onClick={stopPropagation}>
                        <div className={gridCSSPrefix("toolbar-section")} style={{ width: "100%", gap: 2 }}>
                            {pagingEnabled && createSelectField(node.gridOptions, {
                                style: { width: "120px" },
                                onChange: (newValue) => setPageOption(newValue as "all" | "current"),
                                value: pageOption,
                                options: [
                                    { value: "all", name: "All Pages" },
                                    { value: "current", name: "Current Page" }
                                ]
                            })}
                            {
                                exportType === "pdf" &&
                                createSelectField(node.gridOptions, {
                                    style: { width: "120px" },
                                    onChange: (newValue) => setOrientationOption(newValue as PdfOrientation),
                                    value: orientationOption,
                                    options: [
                                        { value: "portrait", name: "Portrait" },
                                        { value: "landscape", name: "Landscape" }
                                    ]
                                })
                            }
                            <div style={{ flexGrow: 1 }}></div>
                            <div className={gridCSSPrefix("toolbar-section")} >
                                {exportType === "pdf" && buttonCreator(node, "export-pdf-icon", "Do Export", doExport, GridIconButton.Pdf)}
                                {exportType === "excel" && buttonCreator(node, "export-excel-icon", "Do Export", doExport, GridIconButton.Excel)}
                                {buttonCreator(node, "close-icon", "Close Popup", () => setPopupVisible(false), GridIconButton.Cancel)}
                            </div>
                        </div>
                    </div>;
                }
            },
            columns: [
                {
                    ...createColumn("headerText", "string", "Columns"),
                    ...COL_PROPS(true),
                    enableDrag: true,
                    headerOptions: {
                        headerRenderer: ({ node }) => {
                            return <div className={gridCSSPrefix("toolbar-spacer")}>
                                <div className={gridCSSPrefix("toolbar-section")} >
                                    {"Select Columns to Export"}
                                </div>
                            </div>;
                        }
                    },
                },
            ]
        }}></ReactDataGrid>
    </>;
};
