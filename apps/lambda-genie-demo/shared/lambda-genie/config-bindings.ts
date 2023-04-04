export const CONFIG = {
    RULE_SETS: {
        HOME_PAGE_PERSONALIZATION: "HOME_PAGE_PERSONALIZATION",
        NEXT_GEN_FEATURE: "NEXT_GEN_FEATURE",
        SCHOOL_ROW_COLOR: "SCHOOL_ROW_COLOR",
    },
    GLOBAL_CONFIGS: {
        LOG_LEVEL: "LOG_LEVEL",
    },
    LAMBDA_CONFIGS: {
        GET_PRODUCTS: {
            NAME: "GET_PRODUCTS",
            SLOT_NAMES: "SLOT_NAMES",
            FEATURED_PRODUCTS: "FEATURED_PRODUCTS",
        },
        GET_SCHOOL_DETAILS: {
            NAME: "GET_SCHOOL_DETAILS",
            GRID_DEFINITION: "GRID_DEFINITION",
            GRID_COLUMN_DEFINITION: "GRID_COLUMN_DEFINITION",
        },
    },
    ENVIRONMENTS: {
        DEV: "dev",
        TEST: "test",
        PRD: "prd",
    },
};


export interface GridConfig {
    rowHeight?: number;
    headerRowHeight?: number;
    footerRowHeight?: number;
    filterRowHeight?: number;
    toolbarHeight?: number;
    enableColumnMenu?: boolean;
    enableContextMenu?: boolean;
    enableToolbar?: boolean;
    enableFilters?: boolean;
    enableFooters?: boolean;
    enablePaging?: boolean;
    sortOptions?: {
        enableMultiColumnSort?: boolean;
        [k: string]: unknown;
    };
    toolbarOptions?: {
        enableGlobalSearch?: boolean;
        enableItemCount?: boolean;
        enableFilterchips?: boolean;
        enableQuickFind?: boolean;
        enablePdf?: boolean;
        enableExcel?: boolean;
        enableSettings?: boolean;
        [k: string]: unknown;
    };
    [k: string]: unknown;
}