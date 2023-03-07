import { ApiContext, ColumnOptions, ColumnWidthMode, createColumn, createFilterBehavior, DateRangeType, FilterOperation, formatCurrency, getApi, getDateRange, HorizontalScrollMode, RendererProps, resolveExpression } from "@euxdt/grid-core";
import { createDateFilterOptions, createMultiSelectFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import { useRef, useState, FC } from "react";
import Employee from "../mockdata/Employee";

const PhoneNumberFilter: FC<RendererProps> = ({ node }) => {
    const api = getApi(node);
    const filterValue = api.getFilterValue("phoneNumber") as string;
    const areaCodeRef = useRef<HTMLInputElement>(null);
    const prefixRef = useRef<HTMLInputElement>(null);
    const suffixRef = useRef<HTMLInputElement>(null);

    let areaCode = "", prefix = "", suffix = "";
    if (filterValue) {
        [areaCode, prefix, suffix] = filterValue.split("-");
    }
    const handleChange = () => {
        const areaCode = areaCodeRef.current?.value || "";
        const prefix = prefixRef.current?.value || "";
        const suffix = suffixRef.current?.value || "";
        if (!areaCode && !prefix && !suffix)
            api.clearFilterValue("phoneNumber");
        else {
            api.setFilterValue("phoneNumber", `${areaCode}-${prefix}-${suffix}`);

        }

    };
    return <div className="euxdt-dg-toolbar-section">
        <input maxLength={3} style={{ width: "30%" }} value={areaCode} ref={areaCodeRef} onChange={handleChange} />-
        <input maxLength={3} style={{ width: "30%" }} value={prefix} ref={prefixRef} onChange={handleChange} />-
        <input maxLength={4} style={{ width: "30%" }} value={suffix} ref={suffixRef} onChange={handleChange} />
    </div>;
};

export const FilterOptions = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const [data] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    const anniversaryRef = useRef<HTMLSelectElement>(null);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        headerRowHeight: 150,
        enableFooters: false,
        horizontalScroll: HorizontalScrollMode.Off,
        behaviors: [
            createFilterBehavior({
                globalFilterMatchFunction: (item: unknown) => {
                    const anniversary = anniversaryRef.current?.value;
                    if (anniversary === "Select" || anniversary === "" || anniversary === undefined)
                        return true;
                    const hireDate = resolveExpression(item, "hireDate");
                    if (!hireDate)
                        return false;
                    const dr = getDateRange(anniversary as DateRangeType);
                    const hireAnniversary = new Date(new Date().getFullYear(), hireDate.getMonth(), hireDate.getDate());
                    return hireAnniversary >= dr.start && hireAnniversary <= dr.end;
                }
            })
        ],
        toolbarOptions: {
            rightToolbarRenderer: ({ node }) => {
                const options = [DateRangeType.Today, DateRangeType.ThisWeek, DateRangeType.ThisMonth,
                DateRangeType.NextWeek, DateRangeType.NextMonth, DateRangeType.LastWeek,
                DateRangeType.LastMonth,
                ];
                const handleFilterChange = (val: string) => {
                    apiRef.current?.api?.rebuild();
                };
                return <div className="euxdt-dg-toolbar-section">
                    Work Anniversary (External Filter + custom filter logic): <select ref={anniversaryRef} onChange={(e) => handleFilterChange(e.target.value)} >
                        <option>Select</option>
                        {
                            options.map((option, idx) => {
                                return <option key={idx} value={option}>{option}</option>;
                            })
                        }
                    </select>
                </div>;
            }
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            }
        }, columns: [
            {
                ...createColumn("employeeId", "string", "Id - Text Filter"),
                textAlign: "right",
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
            },
            {
                filterOptions: {
                    ...createTextInputFilterOptions(FilterOperation.Wildcard),
                    filterWaterMark: "*a,a*,*a*,a*b"
                },
                ...createColumn("firstName", "string", "First Name -  Wildcard"),

            },
            {
                ...createColumn("lastName", "string", "Last Name - Text Filter BeginsWith"),
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
            }
            , {
                ...createColumn("annualSalary", "currency", "Annual Salary - Custom Filter"),
                filterOptions: {
                    filterOperation: FilterOperation.Between,
                    filterRenderer: ({ node }) => {
                        const api = getApi(node);
                        const filterValue = api.getFilterValue("annualSalary");
                        return <div className="euxdt-dg-toolbar-section">
                            <input type="range" min={50000} max={99999} value={filterValue ? resolveExpression(filterValue, "end") : 100000} onChange={(e) => {
                                api.setFilterValue("annualSalary", {
                                    start: 0, end: parseInt(e.target.value)
                                });
                            }} style={{ width: "80px" }} />
                            <span>{"<" + (formatCurrency((resolveExpression(filterValue, "end")), 0) || "99,999")}</span>
                        </div>;
                    }
                }
            },
            {
                ...createColumn("hireDate", "date", "Hire Date - Date Filter + Custom Range Options"),
                filterOptions: createDateFilterOptions([
                    { type: "2010-2020", start: new Date(2010, 0, 1), end: new Date(2020, 11, 31) },
                    { type: "2000-2010", start: new Date(2000, 0, 1), end: new Date(2010, 11, 31) },
                    { type: "1990-2000", start: new Date(1990, 0, 1), end: new Date(2000, 11, 31) },
                    DateRangeType.LastYear,
                    DateRangeType.ThisYear,
                    DateRangeType.Custom
                ])

            },
            {
                ...createColumn("department", "string", "Department - Multi Select Filter"),
                filterOptions: {
                    ...createMultiSelectFilterOptions(),
                    useLabelFunctionForFilterCompare: true,
                }
            },

            {
                filterOptions: {
                    filterRenderer: PhoneNumberFilter,
                    filterCompareFunction: (item: unknown, col: ColumnOptions, value: unknown) => {
                        const phoneFilter = value as string;
                        const phoneItem = resolveExpression(item, col.dataField) as string;
                        if (phoneFilter && phoneItem) {
                            const [areaCode, prefix, suffix] = phoneFilter.split("-");
                            const [itemAreaCode, itemPrefix, itemSuffix] = phoneItem.split("-");
                            if (areaCode && itemAreaCode && areaCode !== itemAreaCode) {
                                return false;
                            }
                            if (prefix && itemPrefix && prefix !== itemPrefix) {
                                return false;
                            }
                            if (suffix && itemSuffix && suffix !== itemSuffix) {
                                return false;
                            }
                        }
                        return true;
                    }
                },
                ...createColumn("phoneNumber", "string", "Phone Number - Custom Filter + Custom Compare Function"),

            }, {
                ...createColumn("isActive", "boolean", "Active - Tri State CheckBox Filter"),
                filterOptions: createTriStateCheckBoxFilterOptions(),
                widthMode: ColumnWidthMode.Fixed,
                width: 75,
            },
            {
                ...createColumn("stateCode", "string", "State - Multi Select Filter"),
                filterOptions: createMultiSelectFilterOptions(),
            }
        ]
    }}></ReactDataGrid>;
};