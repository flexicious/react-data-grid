import { ApiContext, createColumn, createEditBehavior, FooterOperation, getApi, GridOptions, GridSelectionMode, LockMode, resolveExpression } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { createRef, useEffect, useRef, useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import LineItem from "../mockdata/LineItem";
import SystemConstants from "../mockdata/SystemConstants";

export const ItemRenderers = () => {
    const apiRef = useRef<ApiContext<LineItem> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<LineItem[]>([]);
    useEffect(() => {
        setIsLoading(true);
        const getLineItems = async () => {
            const orgs = FlexiciousMockGenerator.instance().getAllLineItems();
            await new Promise((resolve) => setTimeout(resolve, 100));
            setData(orgs);
            setIsLoading(false);
        };
        getLineItems();
    }, []);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
        dataProvider: data,
        isLoading,
        enableFilters: false,
        behaviors: [createEditBehavior({})],
        uniqueIdentifierOptions: {
            useField: "id"
        },
        selectionMode: GridSelectionMode.MultipleRows,
        sortOptions: ({
            initialSort: [{
                sortColumn: "id",
                isAscending: true,
            }]
        }),
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            },
        },
        settingsOptions: {
            settingsStorageKey: "item-renderers-grid"
        },
        cellTooltipFunction: (cellInfo) => {
            const lineItem: LineItem = cellInfo?.rowPosition?.data!;
            if(cellInfo?.columnIdentifier === "invoice.hasPdf" && lineItem?.invoice.hasPdf){
                return "Click to open PDF for invoice " + lineItem.lineItemDescription;
            }
            return "";
        },
        columns: [
            {
                ...createColumn("id"), headerText: "Line Item Number", lockMode: LockMode.Left,
                footerOptions: {
                    footerOperation: FooterOperation.Count, footerLabel: "Count: "
                },
                width: 125,
                textAlign: "center",
            },
            {
                ...createColumn("invoice.hasPdf", "boolean", "Pdf?"),

                itemRenderer: ({ node }) => {
                    const lineItem: LineItem = node.rowPosition!.data!;
                    const openPdf = () => {
                        alert("Opening PDF for invoice " + lineItem?.id);
                    };
                    return <div onClick={openPdf} className={lineItem?.invoice.hasPdf ? "ezgrid-dg-export-pdf-icon" : ""}></div>;
                },
                width: 50,
            },

            {
                ...createColumn("lineItemAmount", "currency"),
                textAlign: "right", headerText: "Line Item Amount",
                footerOptions: { footerOperation: FooterOperation.Max, footerLabel: "Max: " }
            }
            ,
            {
                ...createColumn("invoice.id", "string", "Invoice ID", "invoice.id"),
            },
            {
                ...createColumn("invoice.invoiceStatus.name", "string", "Invoice Status"),

                itemRenderer: ({ node }) => {
                    const lineItem = node.rowPosition!.data!;
                    const api = getApi(node);
                    const selectRef = createRef<HTMLSelectElement>();
                    const change = api.getChanges().find(c => c.rowIdentifier === lineItem.id.toString());
                    const saveChanges = () => {
                        alert("This will save all line items with the same invoice id:" + JSON.stringify(change));
                        resolveExpression(lineItem, node.columnPosition?.column.dataField!, selectRef.current?.value!);
                        if (change)
                            api.removeChange(change.rowIdentifier, change.columnIdentifier);
                    };
                    return <div key={"statusEditor"}> <select ref={selectRef}
                        value={change ? change.newValue : resolveExpression(lineItem, node.columnPosition?.column.dataField!)}
                        onChange={(e) => getApi(node).addChange(node.rowPosition!, node.columnPosition!, e.currentTarget.value)}>
                        {
                            SystemConstants.invoiceStatuses.map((s, index) => {
                                return <option key={index} value={s.name}>{s.name}</option>;
                            })
                        }
                    </select>
                        {change && <button onClick={saveChanges}>Save</button>}
                    </div>;
                },
            },

            {
                ...createColumn("invoice.deal.customer.legalName", "string", "12 Customer"),
                itemRenderer: ({ node }) => {
                    const lineItem = node.rowPosition!.data!;
                    return <a href={`https://www.google.com/search?q=${lineItem.invoice.deal.customer.legalName}`} target="_blank" rel="noreferrer">{lineItem.invoice.deal.customer.legalName}</a>;
                }
            },
            {
                ...createColumn("invoice.deal.customer.id", "string", "Chart"), width: 75,
                itemRenderer: ({ node }) => {
                    const lineItem = node.rowPosition!.data!;
                    return <img alt="Chart for company" src={lineItem.invoice.deal.customer.chartUrl} />;
                }
            },
            {
                ...createColumn("invoice.invoiceDate", "date", "Invoice Date"),
            },

            {
                ...createColumn("lineItemDescription", "string", "Line Item Description"),
                width: 300,
            },

            {
                ...createColumn("invoice.deal.dealDescription", "string", "7 Deal", "invoice.deal.dealDescription7"),
            },
            { ...createColumn("invoice.dueDate", "date", "9 Due Date") },
            { ...createColumn("invoice.deal.dealDescription", "string", "10 Deal") },
            { ...createColumn("invoice.deal.dealStatus.name", "string", "11 Deal Status") },
            { ...createColumn("invoice.deal.customer.headquarterAddress.line1", "string", "13 Address Line 1") },
            { ...createColumn("invoice.deal.customer.headquarterAddress.line2", "string", "14 Address Line 2") },
            {
                ...createColumn("invoice.deal.customer.headquarterAddress.state.name", "string", "State"),
            },
            {
                ...createColumn("invoice.deal.customer.headquarterAddress.city.name", "string", "City"),
            },

            {
                ...createColumn("invoice.deal.customer.headquarterAddress.country.name", "string", "Country")
            },
            {
                ...createColumn("invoice.deal.customer.annualRevenue", "currency", "Annual Revenue")
                , children: [
                    { ...createColumn("invoice.deal.customer.numEmployees", "number", "Num Employees") },
                    { ...createColumn("invoice.deal.customer.earningsPerShare", "number", "EPS") },
                    { ...createColumn("invoice.deal.customer.lastStockPrice", "number", "Stock Price") }
                ]

            },
        ]
    } as GridOptions<LineItem>} />;
};