import { createColumn, getApi, resolveExpression, shortMonthNames } from "@ezgrid/grid-core";
import { ReactDataGrid } from "@ezgrid/grid-react";
import { useState } from "react";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import { createFiscalYearColumnGroup } from "../utils/column-utils";

export const RapidUpdates = () => {
    const [data,] = useState<Record<string, any>[]>(FlexiciousMockGenerator.instance().getFlatOrgList());
    const [fiscalYears] = useState<number[]>([new Date().getFullYear()]);
    const [updatesInterval, setUpdatesInterval] = useState<ReturnType<typeof setInterval> | null>(null);
    return <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
        dataProvider: data,
        uniqueIdentifierOptions: {
            useField: "id"
        },
        settingsOptions: {
            settingsStorageKey: "rapidUpdates"
        },
        toolbarOptions: {
            enableGroupingDropzone: false,
            rightToolbarRenderer: ({ node }) => {
                const api = getApi(node);
                const toggleUpdates = () => {
                    if (updatesInterval) {
                        clearInterval(updatesInterval);
                        setUpdatesInterval(null);
                    } else {
                        const interval = setInterval(() => {
                            //update a random column 
                            const randomColumn = Math.floor(Math.random() * 3);
                            const monthName = shortMonthNames[randomColumn];
                            const visibleRows = api.getContext()?.rowPositions || [];
                            visibleRows.forEach((rowPos) => {
                                const item = rowPos.data as any;
                                item[`${fiscalYears[0]}_${monthName}`] = Math.random() * 60000;
                            });

                            api.repaint();
                        }, 100);
                        setUpdatesInterval(interval);
                    }
                };
                return <div>
                    <button onClick={toggleUpdates}>{updatesInterval === null ? "Start Updates" : "Stop Updates"}</button>
                </div>;

            }
        },
        enableFilters: false, columns: [
            {
                ...createColumn("id", "string", "Id"),
                enableCellClickRowSelect: true,
            },
            {
                ...createColumn("legalName", "string", "Legal Name"),
                enableCellClickRowSelect: true,
            },
            ...createFiscalYearColumnGroup(fiscalYears, {
                width: 100,
                cellStyleFunction: (node) => {
                    const row = node.rowPosition?.data;
                    const col = node.columnPosition?.column.uniqueIdentifier;
                    if (!row || !col || col.indexOf("Q") >= 0 || col === "2020") return {};
                    const value = resolveExpression(row, col);
                    if (value > 50000) {
                        return {
                            color: "green"
                        };
                    } else if (value > 40000) {
                        return {
                            color: "orange"
                        };
                    } else if (value < 30000) {
                        return {
                            color: "red"
                        };
                    } else {
                        return {
                            color: "gray"
                        };
                    }
                }

            })

        ]
    }}></ReactDataGrid>;
};