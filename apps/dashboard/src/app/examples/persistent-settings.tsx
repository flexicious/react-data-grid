import { createColumn, createFilterBehavior, FilterOperation, getApi, LockMode, TreeNodeType } from "@euxdt/grid-core";
import { createNumericRangeFilterOptions, createTextInputFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import { useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";

export const PersistentSettings = () => {
    const [data] = useState<Record<string, any>[]>(FlexiciousMockGenerator.instance().getFlatOrgList());
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        nodeStyleFunction: (node) => {
            if (node.type === TreeNodeType.VDivider) {
                return { width: "3px" };
            }
            return {};
        },
        toolbarOptions: {
            enableGlobalSearch: false,
            enableQuickFind: false,
            enableGroupingDropzone: false,
            leftToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                const settings = api.getContext()?.savedSettings || [];
                const showSettings = () => {
                    let str = "";
                    for (const settingsData of settings) {
                        str += settingsData.name + ": ";
                        for (const col of settingsData.columnSettings) {
                            const { parent, children, ...rest } = col;
                            str += JSON.stringify(rest) + ", ";
                        }
                    }
                    alert(str);
                };
                return <div className="euxdt-dg-toolbar-section">
                    <span>Saved Settings: {Object.keys(settings || {}).length}</span>
                    <button onClick={showSettings}>Show Settings</button>
                </div>;

            },
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                const saveUnlockedSettings = () => {
                    api.unlockAllColumns();
                    api.saveSettings({
                        columnSettings: api.getCurrentSettings(),
                        name: "AllUnlocked"
                    });
                    api.propsUpdated();
                };
                const clearSavedSettings = () => {
                    api.clearAllSettings();
                    api.resetView();
                    api.rebuild();
                };
                const saveFiltersAndSorts = () => {
                    api.setFilterValue("id", "2080");
                    api.setFilterValue("annualRevenue", { start: 20000, end: 80000 });
                    api.setSorts([{ sortColumn: "annualRevenue", isAscending: false }]);
                    api.saveSettings({
                        columnSettings: api.getCurrentSettings(),
                        name: "FiltersAndSorts"
                    });
                    api.propsUpdated();

                };
                return <div className="euxdt-dg-toolbar-section">
                    <span>Save Settings With:</span>
                    <button onClick={saveFiltersAndSorts}>Filters + Sorts</button>
                    <button onClick={saveUnlockedSettings}>Unpin All </button>
                    <button onClick={clearSavedSettings}>Delete  Settings</button>
                    <button onClick={() => api.resetView()}>Reset View</button>
                </div>;

            }
        },
        enableFilters: true,
        behaviors: [createFilterBehavior({})],
        headerRowHeight: 75,
        settingsOptions: {
            settingsStorageKey: "persistent-settings",
        },
        columns: [
            {
                ...createColumn("id", "string", "Id"),
                filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
                lockMode: LockMode.Left,
                headerOptions: { columnGroupText: "Basic Info", },
                children: [
                    {

                        filterOptions: createTextInputFilterOptions(FilterOperation.Contains),
                        ...createColumn("legalName", "string", "Legal Name"),
                    },
                ]

            },

            { ...createColumn("headquarterAddress.line1", "string", "Address Line 1") },
            { ...createColumn("headquarterAddress.line2", "string", "Address Line 2") },
            {
                ...createColumn("headquarterAddress.city.name", "string", "City"),
            },

            {
                ...createColumn("headquarterAddress.state.name", "string", "State"),
            },

            {
                ...createColumn("headquarterAddress.country.name", "string", "Country")
            },
            {
                ...createColumn("annualRevenue", "currency", "Annual Revenue"),
                width: 100,
                filterOptions: createNumericRangeFilterOptions(),
                lockMode: LockMode.Right,
                children: [
                    { ...createColumn("numEmployees", "number", "Num Employees"), width: 100, },
                    { ...createColumn("earningsPerShare", "number", "EPS"), width: 100, },
                    { ...createColumn("lastStockPrice", "number", "Stock Price"), width: 100, }
                ]

            },

        ]
    }}></ReactDataGrid>;
};