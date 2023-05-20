
export enum AdapterType {
    MUI = "mui",
    ANT = "ant",
    BOOTSTRAP = "bootstrap",
    CHAKRA = "chakra",
    NONE = "none"
}

export enum ChartAdapterType {
    HIGHCHARTS = "highcharts",
    RECHARTS = "recharts",
}

export const ADAPTERS = {
    grid: AdapterType.MUI,
    chart: ChartAdapterType.RECHARTS
};
