
export enum AdapterType {
    MUI = "mui",
    ANT = "ant",
    NONE = "none"
}

export enum ChartAdapterType {
    HIGHCHARTS = "highcharts",
}

export const ADAPTERS = {
    grid: AdapterType.MUI,
    chart: ChartAdapterType.HIGHCHARTS
};
