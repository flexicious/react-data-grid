import { ApiContext, createColumn, createFilterBehavior, FilterOperation } from "@euxdt/grid-core";
import { createMultiSelectFilterOptions, createSelectFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import { useEffect, useRef, useState } from "react";
import CustomerOrganization from "../mockdata/CustomerOrganization";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";

export const SaveAsYouGo = () => {
    const apiContext = useRef<ApiContext | null>(null);
    const [settingsJSON, setSettingsJSON] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<CustomerOrganization[]>([]);
    useEffect(() => {
        setIsLoading(true);
        const getLineItems = async () => {
            const orgs = FlexiciousMockGenerator.instance().getFlatOrgList();
            await new Promise((resolve) => setTimeout(resolve, 10));
            setData(orgs);
            setIsLoading(false);
        };
        getLineItems();
    }, []);

    return <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <b>For this grid, as you filter, sort, resize, move, show or hide columns, the view will be saved in saved settings and the grid will revert to that view on page refresh</b>
        <div style={{ display: "flex" }}> <div style={{ flex: 1 }}>
            <ReactDataGrid style={{ height: "600px", width: "100%" }} gridOptions={{
                dataProvider: data,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                enableFilters: true,
                behaviors: [createFilterBehavior({})],
                headerRowHeight: 75,
                isLoading,
                eventBus: {
                    onApiContextReady: (ctx) => {
                        apiContext.current = (ctx);
                        const settings = window.localStorage.getItem("save-as-you-go");
                        setSettingsJSON(settings || "");
                    },
                    onSettingsSaved: (savedSettings) => {
                        setSettingsJSON(JSON.stringify(savedSettings));
                    }
                },
                settingsOptions: {
                    settingsStorageKey: "save-as-you-go",
                    enableSaveAsYouGo: true,
                },
                columns: [
                    {
                        ...createColumn("id", "string", "Id"),
                        filterOptions: createTextInputFilterOptions(FilterOperation.BeginsWith),
                        headerOptions: { columnGroupText: "Basic Info", },
                        children: [
                            {

                                filterOptions: createTextInputFilterOptions(FilterOperation.Contains),
                                ...createColumn("legalName", "string", "Legal Name"),
                            },
                        ]

                    },
                    {
                        ...createColumn("headquarterAddress.city.name", "string", "City"),
                        filterOptions: createSelectFilterOptions(),
                    },

                    {
                        ...createColumn("headquarterAddress.state.name", "string", "State"),
                        filterOptions: createMultiSelectFilterOptions(),
                    },

                    {
                        ...createColumn("isActive", "boolean", "IsActive"),
                        filterOptions: createTriStateCheckBoxFilterOptions(),
                    },

                ]
            }}></ReactDataGrid>

        </div>
            <div style={{ flex: 1 }}>
                <textarea style={{ width: "100%", height: "100%" }} value={settingsJSON} readOnly>

                </textarea>
            </div>

        </div>
    </div>;
};