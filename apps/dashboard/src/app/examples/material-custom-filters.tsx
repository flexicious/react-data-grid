import { ApiContext, ColumnOptions, ColumnWidthMode, createColumn, createFilterBehavior, createSelectionColumn, DateRangeType, FilterOperation, getApi, getDateRange, RendererProps, resolveExpression } from "@ezgrid/grid-core";
import { createDateFilterOptions, createMultiSelectFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import { Autocomplete, MenuItem, Select, Slider, TextField, useTheme } from "@mui/material";
import { FC, ReactNode, useRef, useState } from "react";
import { materialAdapter, materialNodePropsFunction } from "@ezgrid/grid-shared";
import Employee from "../mockdata/Employee";
import { MaterialWrapper } from "./material/material-wrapper";

export const MaterialFilterDemo = () => <MaterialWrapper demo={<FilterOptions />} />;
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
    return <div className="ezgrid-dg-toolbar-section" style={{ width: "100%", }}>
        <div>{materialAdapter.createTextField({ placeholder: "Area Code", ref: areaCodeRef, defaultValue: areaCode, onChange: handleChange }) as ReactNode}</div>
        <div>{materialAdapter.createTextField({ placeholder: "Prefix", ref: prefixRef, defaultValue: prefix, onChange: handleChange }) as ReactNode}</div>
        <div>{materialAdapter.createTextField({ placeholder: "Suffix", ref: suffixRef, defaultValue: suffix, onChange: handleChange }) as ReactNode}</div>
    </div >;
};
const FilterOptions = () => {
    const apiRef = useRef<ApiContext | null>(null);
    const theme = useTheme();
    const [data] = useState<Record<string, any>[]>(Employee.getAllEmployees());
    const anniversaryRef = useRef<string>("Select");
    const [useMaterialAdapter, setUseMaterialAdapter] = useState(true);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "employeeId"
        },
        adapter: useMaterialAdapter ? materialAdapter : undefined,
        nodePropsFunction: useMaterialAdapter ? materialNodePropsFunction(theme): undefined,
        headerRowHeight: 100,
        filterRowHeight: 100,
        toolbarHeight: 100,
        enableFooters: false,
        behaviors: [
            createFilterBehavior({
                globalFilterMatchFunction: (item: unknown) => {
                    const anniversary = anniversaryRef.current;
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
            enableGlobalSearch: false,
            enableQuickFind: false,

            leftToolbarRenderer: () => (
                <div className="ezgrid-dg-toolbar-section">
                  <button
                    onClick={() => {
                      setUseMaterialAdapter(!useMaterialAdapter);
                    }}
                  >
                    Toggle MUI Adapter
                  </button>
                </div>
              ),
            


            rightToolbarRenderer: ({ node }) => {
                const options = [DateRangeType.Today, DateRangeType.ThisWeek, DateRangeType.ThisMonth,
                DateRangeType.NextWeek, DateRangeType.NextMonth, DateRangeType.LastWeek,
                DateRangeType.LastMonth,
                ];
                const api = getApi(node);
                return <div  >
                    <div className="ezgrid-dg-toolbar-section" style={{ flexDirection: "column", alignItems: "end" }}>
                        <div className="ezgrid-dg-toolbar-section">
                            Department (External Filter + grid filter logic):
                            <Autocomplete
                                filterSelectedOptions
                                options={Employee.allDepartments.map(d => ({ value: d.data, name: d.label }))}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                multiple
                                style={{ width: 300 }}
                                value={(api.getFilterValue("department") as string[] || []).map((v: string) => ({ value: v, name: v })) || []}
                                onChange={(e, value) => {
                                    if (value && value.length)
                                        api.setFilterValue("department", value.map(v => v.value));
                                    else
                                        api.clearFilterValue("department");

                                }}
                                renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select Department" />}
                            />
                        </div>
                        <div className="ezgrid-dg-toolbar-section">
                            Work Anniversary (External Filter + custom filter logic):
                            <Select variant="standard" style={{ width: 300 }} onChange={(e) => {
                                anniversaryRef.current = e.target.value as string;
                                apiRef.current?.api?.rebuild();
                            }}
                                value={anniversaryRef.current}>
                                <MenuItem value="Select">Select</MenuItem>
                                {
                                    options.map((option, idx) => {
                                        return <MenuItem key={idx} value={option}>{option}</MenuItem>;
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                </div>;
            }
        },
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
            }
        }, columns: [
            {
                ...createSelectionColumn({
                    itemRenderer: SelectionCheckBoxRenderer,
                    headerRenderer: SelectionCheckBoxHeaderRenderer
                }),
            },
            {
                ...createColumn("employeeId", "string", "Id - Text Filter"),
                textAlign: "right",
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
            }, {
                ...createColumn("annualSalary", "currency", "Annual Salary - Custom Filter"),
                filterOptions: {
                    filterOperation: FilterOperation.Between,
                    filterRenderer: ({ node }) => {
                        const api = getApi(node);
                        const filterValue = api.getFilterValue("annualSalary");
                        return <div style={{ width: "100%", height: "100%", paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "end" }}>
                            <Slider
                                value={filterValue ? [resolveExpression(filterValue, "start"), resolveExpression(filterValue, "end")] : [0, 100000]}
                                onChange={(e, val) => api.setFilterValue("annualSalary", { start: (val as number[])[0], end: (val as number[])[1] })}
                                valueLabelDisplay="auto"
                                min={50000} max={100000}
                                aria-labelledby="range-slider"
                                getAriaValueText={(value) => `${value}K`}
                                marks={[{ value: 50000, label: "50K", }, { value: 75000, label: "75K", }, { value: 100000, label: "100K", }]}
                            />
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
                ...createColumn("department", "string", "Department - External Filter"),
                filterOptions: {
                    filterOperation: FilterOperation.InList
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
            },
            {
                filterOptions: createTextInputFilterOptions(FilterOperation.Contains),
                ...createColumn("firstName", "string", "First Name - Text Filter Contains"),
            },
            {
                ...createColumn("lastName", "string", "Last Name - Text Filter BeginsWith"),
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
            }

        ]
    }}></ReactDataGrid >;
};