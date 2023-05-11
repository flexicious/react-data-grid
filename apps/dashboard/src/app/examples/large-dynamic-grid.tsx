import { ApiContext, ColumnOptions, GridOptions, createColumn, getFlat, resolveExpression } from "@ezgrid/grid-core";
import { ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { useMemo, useRef } from "react";
import Employee from "../mockdata/Employee";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

interface CarData {
    make:string;
    id:string;
    children:  Record<string, unknown>[]
}
export const LargeDynamicGrid = () => {
    const makeModels = [{ "make": "Toyota", "models": ["4Runner", "Avalon", "Camry", "Celica", "Corolla", "Corona", "Cressida", "Echo", "FJ Cruiser", "Highlander", "Land Cruiser", "MR2", "Matrix", "Paseo", "Pickup", "Previa", "Prius", "RAV4", "Seqouia", "Sienna", "Solara", "Supra"] },
    { "make": "Acura", "models": ["Integra", "Legend", "MDX", "NSX", "RDX", "RSX", "SLX", "3.2TL", "2.5TL", "Vigor", "ZDX"] },
    { "make": "Nissan", "models": ["200SX", "240SX", "300ZX", "350Z", "370Z", "Altima", "Armada", "Cube", "Frontier", "GT-R", "Juke", "Leaf", "Maxima", "Murano", "NX", "PathFinder", "Pickup", "Pulsar", "Quest"] },
    { "make": "Mazda", "models": ["323", "626", "929", "B-Series", "CX-5", "CX-7", "CX-9", "Miata MX-5", "Millenia", "MPV", "MX-3", "MX-6", "Protege", "Protege5", "RX-7", "RX-8", "Tribute"] },
    { "make": "Subaru", "models": ["Baja", "BRZ", "Forester", "Impreza", "Legacy", "Outback", "SVX", "Tribeca", "WRX", "XV Crosstrek"] },
    { "make": "Volkswagen", "models": ["Beetle", "Cabrio", "CC", "Corrado", "Eos", "Eurovan", "Fox", "Golf", "GTI", "Jetta", "Passat", "Rabbit", "Routan", "Tiguan", "Touareg", "Vanagon"] },
    { "make": "Audi", "models": ["A3", "A4", "A5", "A6", "A7", "A8", "Allroad", "Cabriolet", "Coupe", "Q3", "Q5", "Q7", "R8", "RS4", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "TT", "TTS"] },
    { "make": "BMW", "models": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "M2", "M3", "M4", "M5", "M6", "X1", "X3", "X4", "X5", "X6", "Z3", "Z4", "Z8"] },
    { "make": "Mercedes-Benz", "models": ["190-Class", "300-Class", "400-Class", "500-Class", "600-Class", "AMG GT", "AMG GT 4-Door", "AMG GT C", "AMG GT R", "AMG GT S", "B-Class", "C-Class", "CL-Class"] },
    { "make": "Ford", "models": ["Bronco", "Bronco II", "C-Max", "Club Wagon", "Contour", "Crown Victoria", "Econoline", "Edge", "Escape", "Escort", "Excursion", "Expedition", "Explorer", "F-Series", "Fiesta", "Flex", "Focus", "Freestar", "Freestyle", "Fusion", "Mustang", "Ranger", "Taurus"] },
    { "make": "Chevrolet", "models": ["Astro", "Avalanche", "Aveo", "Beretta", "Blazer", "Camaro", "Caprice", "Captiva Sport", "Cavalier", "Celebrity", "Chevelle", "Citation", "Cobalt", "Colorado", "Corsica", "Corvette", "Cruze", "El Camino", "Equinox", "Express", "HHR", "Impala", "Kodiak", "Lumina", "Malibu", "Monte Carlo", "Nova", "S10 Blazer", "Silverado", "SSR", "Suburban", "Tahoe", "Tracker", "TrailBlazer", "Traverse", "Uplander", "Venture", "Volt"] },
    { "make": "Dodge", "models": ["400", "600", "Aries", "Avenger", "Caliber", "Caravan", "Challenger", "Charger", "Colt", "Conquest", "Dakota", "Dart", "Daytona", "Diplomat", "Durango", "Dynasty", "Grand Caravan", "Intrepid", "Journey", "Magnum", "Mirada", "Monaco", "Neon", "Nitro", "Omni", "Raider", "Ram 1500", "Ram 2500", "Ram 3500", "Ram 4500", "Ram 5500", "Ram 60", "Ram 600", "Ram 70", "Ram 700", "Ram 80", "Ram 800", "Ramcharger", "Shadow", "Spirit", "Sprinter", "SRT-4", "St. Regis", "Stealth", "Stratus", "Viper"] },
    { "make": "GMC", "models": ["Acadia", "Canyon", "Envoy", "Jimmy", "Safari", "Savana", "Sierra 1500", "Sierra 2500", "Sierra 3500", "Sonoma", "Suburban", "Terrain", "Yukon", "Yukon XL 1500", "Yukon XL 2500"] },
    { "make": "Honda", "models": ["Accord", "Civic", "CR-V", "CR-Z", "CRX", "Element", "Fit", "Insight", "Odyssey", "Passport", "Pilot", "Prelude", "Ridgeline", "S2000"] },
    { "make": "Hyundai", "models": ["Accent", "Azera", "Elantra", "Entourage", "Equus", "Excel", "Genesis", "Genesis Coupe", "Santa Fe", "Sonata", "Tiburon", "Tucson", "Veloster"] },
    { "make": "Infiniti", "models": ["EX35", "FX35", "FX45", "G20", "G35", "G37", "I30", "I35", "J30", "JX35", "M30", "M35", "M37", "M45", "M56", "Q45", "Q50", "Q60", "Q70", "QX4", "QX50", "QX56", "QX60", "QX70", "QX80"] },
    { "make": "Isuzu", "models": ["Amigo", "Ascender", "Axiom", "Hombre", "i-280", "i-290", "i-350", "i-370", "Impulse", "Oasis", "Rodeo", "Rodeo Sport", "Stylus", "Trooper", "VehiCROSS"] },
    { "make": "Jaguar", "models": ["S-Type", "X-Type", "XF", "XJ", "XJ8", "XJR", "XJS", "XK", "XK8", "XKR", "XKR-S"] },
    { "make": "Jeep", "models": ["Cherokee", "Comanche", "Commander", "Compass", "Grand Cherokee", "Liberty", "Patriot", "Renegade", "Wrangler"] },
    { "make": "Kia", "models": ["Amanti", "Borrego", "Forte", "Forte Koup", "Forte5", "Optima", "Rio", "Rio5", "Rondo", "Sedona", "Sephia", "Sorento", "Soul", "Spectra", "Sportage"] },
    { "make": "Land Rover", "models": ["Defender", "Discovery", "Discovery Series II", "Freelander", "LR2", "LR3", "LR4", "Range Rover", "Range Rover Evoque", "Range Rover Sport"] },
    { "make": "Lexus", "models": ["CT 200h", "ES 250", "ES 300", "ES 300h", "ES 330", "ES 350", "GS 300", "GS 350", "GS 400", "GS 430", "GS 450h", "GS 460", "GX 470", "HS 250h", "IS 200t", "IS 250", "IS 300", "IS 350", "IS-F", "LS 400", "LS 430", "LS 460", "LS 600h L", "LX 450", "LX 470", "LX 570", "NX 200t", "NX 300h", "RC 200t", "RC 300", "RC 350", "RX 300", "RX 330", "RX 350", "RX 400h", "RX 450h", "SC 300", "SC 400", "SC 430"] },
    { "make": "Lincoln", "models": ["Aviator", "Blackwood", "Continental", "LS", "Mark LT", "Mark VII", "Mark VIII", "MKC", "MKS", "MKT", "MKX", "MKZ", "Navigator", "Town Car", "Zephyr"] },
    { "make": "Mazda", "models": ["323", "626", "929", "B-Series", "CX-5", "CX-7", "CX-9", "GLC", "Mazda2", "Mazda3", "Mazda5", "Mazda6", "Mazda6 5-Door", "Mazda6 Wagon", "Mazdaspeed3", "Mazdaspeed6", "Miata MX-5", "MPV", "MX-3", "MX-5 Miata", "MX-6", "Navajo", "Protege", "Protege5", "RX-7", "RX-8", "Tribute"] },




    ];
    const colors: string[] = ["Red", "Yellow", "Silver", "Green", "Tan", "White", "Blue", "Burgundy", "Black", "Orange", "Brown", "Purple", "Gold", "Beige", "Gray"
        , "Copper", "Pink", "Teal", "Maroon", "Magenta", "Lime",];


    const dp:CarData[] = [];
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
    const fiscalYears = createFiscalYearColumnGroup<CarData>([2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].reverse(), {
        width: 100
    });
    const allCols = getFlat<ColumnOptions<CarData>>(fiscalYears);
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
                    resolveExpression(color, mCol.dataField, Employee.getRandom(1000, 10000));
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

    const apiRef = useRef<ApiContext<CarData> | null>(null);
    const gridOptions = useMemo<GridOptions<CarData>>(()=>({
        dataProvider: (dp),
        enableFilters: false,
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
                apiRef.current?.api?.expandAll();
            }
        },
        uniqueIdentifierOptions: {
            useField: "id"
        },
        toolbarOptions: {
            leftToolbarRenderer: ({ node }) => <div style={{ display: "flex", alignItems: "center" }}>
                {node.gridOptions.contextInfo?.rowPositions.length} Rows, {node.gridOptions.contextInfo?.flatColumns.length} Columns,
            </div>
        },

        enableDynamicLevels: true,
        nextLevel: {
            childrenField: "children",
        },
        groupHeaderOptions: {
            enableGroupHeaders: true,
            useHierarchyColumnForRenderer: true,
        },
        enableFloatingHeaderRows: true,
        floatingRowsOptions: {
            floatingColumns: ["id"],
            maxFloatingRows: 2,
        },
        selectionOptions: {
            enableSelectionCascade: true,
            enableSelectionBubble: true,
        },
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                enableHierarchy: true,
                labelFunction: (item) => resolveExpression(item, "color") || resolveExpression(item, "model") || resolveExpression(item, "make"),

                selectionCheckBoxOptions: {
                    selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                    selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer
                }
            },
            ...fiscalYears
        ]
    }),[dp,])
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={gridOptions}></ReactDataGrid>;
};