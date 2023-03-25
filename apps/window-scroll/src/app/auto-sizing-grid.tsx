import { ApiContext, ColumnOptions, createColumn, shortMonthNames,getFlat, resolveExpression, LockMode, createFilterBehavior } from "@euxdt/grid-core";
import { createDeleteColumn, createMultiSelectFilterOptions, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@euxdt/grid-react";
import { useRef } from "react";

export const createFiscalYearColumnGroup = (years: number[], options?: Partial<ColumnOptions>, dataFieldPrefix?: string, callback?: (c: ColumnOptions) => ColumnOptions, createQuarters?: boolean, createMonths?: boolean) => {
    const colDefaults = options || [];
    const prefix = dataFieldPrefix || "";
    const yearColumns = years.map((year) => {
        const yearColumn = {
            ...createColumn(`${prefix}${year}`, "currency", `${year}`),
            children: [],
            ...colDefaults,
        };
        if (createQuarters !== false) {
            const quarterColumns = [null, null, null, null]
                .map((_, i) => {
                    const quarterNum = i + 1;
                    return {
                        ...createColumn(`${prefix}${year}_Q${quarterNum}`, "currency", `Q${quarterNum} ${year}`),
                        children: [],
                        ...colDefaults,
                    };
                });
            yearColumn.children = quarterColumns;
            if (createMonths !== false) {
                let monthIndex = 0;
                quarterColumns.forEach((quarterColumn, quarterNum) => {
                    const monthColumns = [null, null, null]
                        .map((_, i) => {
                            const month = shortMonthNames[monthIndex++];
                            return {
                                ...createColumn(`${prefix}${year}_${month}`, "currency", `${month} ${year}`),
                                ...colDefaults,
                            };
                        });
                    quarterColumn.children = monthColumns;
                });
            }
        }
        return yearColumn;
    });
    return yearColumns;
};
export const getRandom=(minNum:number, maxNum:number) => {
    return Math.ceil(Math.random() * (maxNum - minNum + 1)) + (minNum - 1);
  }
export const AutoSizingGrid = () => {
    const makeModels = [{ "make": "Toyota", "models": ["4Runner", "Avalon", "Camry", "Celica", "Corolla", "Corona", "Cressida", "Echo", "FJ Cruiser", "Highlander", "Land Cruiser", "MR2", "Matrix", "Paseo", "Pickup", "Previa", "Prius", "RAV4", "Seqouia", "Sienna", "Solara", "Supra"] },
    { "make": "Acura", "models": ["Integra", "Legend", "MDX", "NSX", "RDX", "RSX", "SLX", "3.2TL", "2.5TL", "Vigor", "ZDX"] },
    { "make": "Nissan", "models": ["200SX", "240SX", "300ZX", "350Z", "370Z", "Altima", "Armada", "Cube", "Frontier", "GT-R", "Juke", "Leaf", "Maxima", "Murano", "NX", "PathFinder", "Pickup", "Pulsar", "Quest"] },
    { "make": "Mazda", "models": ["323", "626", "929", "B-Series", "CX-5", "CX-7", "CX-9", "Miata MX-5", "Millenia", "MPV", "MX-3", "MX-6", "Protege", "Protege5", "RX-7", "RX-8", "Tribute"] },
    { "make": "Subaru", "models": ["Baja", "BRZ", "Forester", "Impreza", "Legacy", "Outback", "SVX", "Tribeca", "WRX", "XV Crosstrek"] }
    ];
    const colors: string[] = ["Red", "Yellow", "Silver", "Green", "Tan"];


    const dp = [];
    for (let i = 0; i < makeModels.length; i++) {
        const m = makeModels[i];
        const mk = {
            "make": m.make,
            "id": m.make,
            "children": [] as Record<string, unknown>[]
        };
        dp.push(mk);
        for (let j = 0; j < m.models.length; j++) {
            const mod = m.models[j];
            mk.children.push({ "model": mod, "id": m.make + "." + mod });
        }
    }
    const fiscalYears = createFiscalYearColumnGroup([2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].reverse(), {
        width: 100
    });
    const allCols = getFlat<ColumnOptions>(fiscalYears);
    for (let i = 0; i < dp.length; i++) {
        const dpItem = dp[i];
        for (let j = 0; j < dpItem.children.length; j++) {
            const model = dpItem.children[j];
            model.children = [];
            for (let k = 0; k < colors.length; k++) {
                const cl = colors[k];
                const color = { "color": cl, "id": model.id + "." + cl };
                (model.children as Record<string, unknown>[]).push(color);
                for (let p = 0; p < allCols.length; p++) {
                    const mCol = allCols[p];
                    resolveExpression(color, mCol.dataField, getRandom(1000, 10000));
                }
            }
        }
    }
    for (let i = 0; i < allCols.length; i++) {
        let mCol = allCols[i];
        for (let j = 0; j < dp.length; j++) {
            let dpItem = dp[j];
            let total = 0;
            for (let k = 0; k < dpItem.children.length; k++) {
                let model = dpItem.children[k];
                let modeltotal = 0;
                const children = resolveExpression(model, "children");
                for (let p = 0; p < children.length; p++) {
                    const color = children[p];
                    modeltotal += color[mCol.dataField];
                }
                model[mCol.dataField] = modeltotal;
                total += modeltotal;
            }
            resolveExpression(dpItem, mCol.dataField, total);
        }
    }

    const apiRef = useRef<ApiContext | null>(null);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: (dp),
        behaviors:[
            createFilterBehavior({}),
        ],
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
                apiRef.current?.api?.expandAll();
            }
        },
        uniqueIdentifierOptions: {
            useField: "id"
        },
        enableWindowVerticalScroll: true,
        windowScrollOptions: {
            topOffset: 30
        },
        enableDynamicLevels: true,
        nextLevel: {
            childrenField: "children",
        },
        groupHeaderOptions: {
            enableGroupHeaders: true,
            useHierarchyColumnForRendererLeftLocked: true,
        },
        selectionOptions: {
            enableSelectionCascade: true,
            enableSelectionBubble: true,
        },
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                lockMode: LockMode.Left,
                enableHierarchy: true,
                filterOptions: {
                    ...createMultiSelectFilterOptions({}),
                },
                labelFunction: (item) => resolveExpression(item, "color") || resolveExpression(item, "model") || resolveExpression(item, "make"),

                selectionCheckBoxOptions: {
                    selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                    selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer
                }
            },
            ...fiscalYears,
            {
                ...createDeleteColumn(()=>{}),
                lockMode: LockMode.Right,
            }
        ]
    }}></ReactDataGrid>;
};