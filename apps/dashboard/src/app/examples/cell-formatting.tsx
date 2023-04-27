
import { ApiContext, createColumn, FilterOperation, FooterOperation, formatCurrency, GridSelectionMode, LockMode, NodeKeys, resolveExpression, RowType, VirtualTreeNode } from "@ezgrid/grid-core";
import { createTextInputFilterOptions } from "@ezgrid/grid-react";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "../components/DataGrid";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import Organization from "../mockdata/Organization";

export const CellFormatting = () => {
    const apiContext = useRef<ApiContext | null>(null);
    const [dataProvider, setDataProvider] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        const getOrgs = async () => {
            const orgs = FlexiciousMockGenerator.instance().getFlatOrgList();
            //emulating a server call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setDataProvider(orgs);
            setIsLoading(false);
        };
        getOrgs();
    }, []);

    return (<DataGrid style={{ height: "100%", width: "100%" }} id="bigGrid" gridOptions={{
        dataProvider,
        isLoading,
        enableFloatingHeaderRows: true,
        eventBus: {
            onApiContextReady: (ctx) => {
                apiContext.current = (ctx);
            }
        },
        cellStyleFunction: (node: VirtualTreeNode) => {
            //style the header, footer, filter, and group headers outside the body
            if (node.rowPosition?.uniqueIdentifier === RowType.Header
                || node.rowPosition?.uniqueIdentifier === RowType.Footer
                || node.rowPosition?.uniqueIdentifier === RowType.Filter
                || (node.classNames?.indexOf("group-header-cell") || 0) > 0) {
                return { background: "#6666FF" };
            }
            if (node.columnPosition?.column.uniqueIdentifier === "annualRevenue") {
                const annualRevenue = resolveExpression(node.rowPosition?.data, "annualRevenue");
                if (annualRevenue > 25000) {
                    return { borderRight: "none", color: "green", background: "#afefef" };
                } else {
                    return { border: "none", color: "red", background: "#afefef" };
                }
            }
            return { borderRight: "none", }; //remove the default border
        },
        nodeStyleFunction: (node: VirtualTreeNode) => {
            //toobar is neither a row or a cell, so we need to style it separately
            if (node.key === NodeKeys.Toolbar) {
                return { background: "#33FFFF" };
            }
            return node.styles;
        },
        rowStyleFunction(node: VirtualTreeNode) {
            //use the level to determine the background color inside the body
            const allRowPositions = apiContext.current?.context?.rowPositions;
            const shades = ["#33FFFF", "#66CCCC", "#9999CC", "#6666FF"];
            const index = node.rowPosition ? (allRowPositions?.indexOf(node.rowPosition) || 0) % shades.length : 1;
            const isActive = (node.rowPosition?.uniqueIdentifier === node.gridOptions.contextInfo?.modifications.activeCell?.rowIdentifier);

            return { background: isActive ? "#33FFFF" : shades[index], borderTop: "solid 1px " + shades[index + 1] };
        },
        uniqueIdentifierOptions: {
            useField: "id"
        },
        selectionMode: GridSelectionMode.MultipleRows,
        toolbarOptions: {
            enablePdf: true,
            enableExcel: true,
        },
        sortOptions: ({
            initialSort: [{
                sortColumn: "id",
                isAscending: true,
            }]
        }),
        settingsOptions: {
            settingsStorageKey: "nested-grid"
        },
        columns: [
            {
                ...createColumn("id"), headerText: "ID",
                enableHierarchy: true,
                footerOptions: {
                    footerOperation: FooterOperation.Count, footerLabel: "Count: "
                },
                lockMode: LockMode.Left,
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith)
            },
            {
                ...createColumn("legalName", "string", "Name"),
            },
            {
                ...createColumn("annualRevenue", "currency", "Annual Revenue")
                , children: [
                    { ...createColumn("numEmployees", "number", "Num Employees"), format: (item) => formatCurrency(parseInt(String(item)), 0) },
                    { ...createColumn("earningsPerShare", "number", "EPS"), format: (item) => parseInt(String(item)).toFixed(2) },
                    { ...createColumn("lastStockPrice", "number", "Stock Price") }
                ]
            }
        ],
    }} />
    );
};

