import { ColumnOptions, createColumn, shortMonthNames } from "@euxdt/grid-core";

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
