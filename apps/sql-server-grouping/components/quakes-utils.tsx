import { ColumnOptions, FilterOperation, FooterOperation, LockMode, RangeFilterRendererProps, RendererProps, createColumn } from "@ezgrid/grid-core";
import { NumericRangeFilter, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions } from "@ezgrid/grid-react";
export interface  EarthquakeData  {
    time: string;
    latitude: number;
    longitude: number;
    depth: number;
    mag: number;
    magType: string;
    nst: number | '';
    gap: number | '';
    dmin: number | '';
    rms: number | '';
    net: string;
    id: string;
    updated: string;
    place: string;
    type: string;
    horizontalError: number | '';
    depthError: number | '';
    magError: string;
    magNst: number;
    status: string;
    locationSource: string;
    magSource: string;
  };

  
export const QUAKE_COLS:ColumnOptions<EarthquakeData>[] =
[

    {
        ...createColumn<EarthquakeData>("id","string","Id"),
        filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
        textAlign:"right",
        footerOptions: {footerOperation:FooterOperation.Count}
    },
    {
        ...createColumn<EarthquakeData>("place","string","Place"),
        filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
    },
    {
        ...createColumn<EarthquakeData>("timeYear","number","Year"),
        filterOptions: createNumericRangeFilterOptions(),
        skipFormatter: true,
    },
    {
        ...createColumn<EarthquakeData>("timeMonth","number","Month"),
        filterOptions: createNumericRangeFilterOptions(),
        skipFormatter: true,
    },{
        ...createColumn<EarthquakeData>("timeDay","number","Day"),
        filterOptions: createNumericRangeFilterOptions(),
        skipFormatter: true,
    },
    {
        ...createColumn<EarthquakeData>("depth","number","Depth"),
        filterOptions: createNumericRangeFilterOptions(),
        formatterPrecision:4,
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("mag","number","Mag"),
        formatterPrecision:2,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("magType","string","Mag Type"),
        filterOptions: createMultiSelectFilterOptions()
    },
    {
        ...createColumn<EarthquakeData>("type","string","Type"),
        filterOptions: createMultiSelectFilterOptions()
    },
    {
        ...createColumn<EarthquakeData>("status","string","Status"),
        filterOptions: createMultiSelectFilterOptions()
    },
    {
        ...createColumn<EarthquakeData>("locationSource","string","Location Source"),
        filterOptions: createMultiSelectFilterOptions()
    },
    {
        ...createColumn<EarthquakeData>("magSource","string","Mag Source"),
        filterOptions: createMultiSelectFilterOptions()
    },
    {
        ...createColumn<EarthquakeData>("latitude","number","Latitude"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("longitude","number","Longitude"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("nst","number","Nst"),
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("gap","number","Gap"),
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("dmin","number","Dmin"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("rms","number","Rms"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("net","string","Net"),
        filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
    },
    {
        ...createColumn<EarthquakeData>("updated","string","Updated"),
        filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
    },
    {
        ...createColumn<EarthquakeData>("horizontalError","number","Horizontal Error"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("depthError","number","Depth Error"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
    {
        ...createColumn<EarthquakeData>("magError","number","Mag Error"),
        formatterPrecision:4,
        filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
    },
    {
        ...createColumn<EarthquakeData>("magNst","number","Mag Nst"),
        formatterPrecision:4,
        filterOptions: createNumericRangeFilterOptions(),
        footerOptions: {footerOperation:FooterOperation.Avg},
    },
];

export const DISTINCT_COLS = QUAKE_COLS.filter((col) => col.filterOptions?.filterOperation===FilterOperation.InList);
export const INITIAL_SORT = [
    {
        sortColumn:"timeYear",
        isAscending:false
    },
    {
        sortColumn:"timeMonth",
        isAscending:false
    },
    {
        sortColumn:"timeDay",
        isAscending:false
    }
];