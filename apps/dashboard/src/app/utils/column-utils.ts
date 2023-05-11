import { ColumnOptions, GRID_CONSTANTS, HorizontalScrollMode, createColumn, shortMonthNames } from "@ezgrid/grid-core";

export const createFiscalYearColumnGroup = <T=unknown>(years: number[], options?: Partial<ColumnOptions<T>>, dataFieldPrefix?: string, callback?: (c: ColumnOptions<T>) => ColumnOptions<T>, createQuarters?: boolean, createMonths?: boolean) => {
    const colDefaults = options || [];
    const prefix = dataFieldPrefix || "";
    const yearColumns = years.map((year) => {
        const yearColumn = {
            ...createColumn<T>(`${prefix}${year}`, "currency", `${year}`),
            children: [],
            ...colDefaults,
        };
        if (createQuarters !== false) {
            const quarterColumns = [null, null, null, null]
                .map((_, i) => {
                    const quarterNum = i + 1;
                    return {
                        ...createColumn<T>(`${prefix}${year}_Q${quarterNum}`, "currency", `Q${quarterNum} ${year}`),
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
                                ...createColumn<T>(`${prefix}${year}_${month}`, "currency", `${month} ${year}`),
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

export const getScrollOffBelow =  (cutoff=GRID_CONSTANTS.MOBILE_CUTOFF) => window.innerWidth < cutoff ? HorizontalScrollMode.On : HorizontalScrollMode.Off;