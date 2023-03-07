import {
  ApiContext,
  createColumn,
  createDragColumn,
  createEditBehavior,
  createFilterBehavior,
  createSelectionColumn,
  DateRangeType,
  GRID_CONSTANTS,
  FilterOperation,
  FooterOperation,
  GridSelectionMode,
  LockMode,
} from "@euxdt/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@euxdt/grid-export";
import {
  createDateFilterOptions,
  createMultiSelectFilterOptions,
  createNumericRangeFilterOptions,
  createSelectFilterOptions,
  createTextInputFilterOptions,
  createTriStateCheckBoxFilterOptions,
  ReactDataGrid,
  SelectionCheckBoxHeaderRenderer,
  SelectionCheckBoxRenderer,
} from "@euxdt/grid-react";
import { Expand } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  materialAdapter,
  materialNodePropsFunction,
} from "@euxdt/grid-shared";

import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import LineItem from "../mockdata/LineItem";
import { MaterialWrapper } from "./material/material-wrapper";

export const MaterialDemo = () => <MaterialWrapper demo={<Demo />} />;
export const Demo = () => {
  const apiRef = useRef<ApiContext | null>(null);
  const [dataProvider, setDataProvider] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [useMaterialAdapter, setUseMaterialAdapter] = useState(true);
  useEffect(() => {
    setLoading(true);
    const getLineItems = async () => {
      const orgs = FlexiciousMockGenerator.instance().getAllLineItems();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDataProvider(orgs);
      setLoading(false);
    };
    getLineItems();
  }, []);
  const theme = useTheme();
  const [rowHeight, setRowHeight] = useState(GRID_CONSTANTS.DEFAULT_ROW_HEIGHT);
  const toggleRowHeights = () => {
    setRowHeight(
      rowHeight === GRID_CONSTANTS.DEFAULT_ROW_HEIGHT
        ? GRID_CONSTANTS.DEFAULT_ROW_HEIGHT / 2
        : GRID_CONSTANTS.DEFAULT_ROW_HEIGHT
    );
    apiRef.current?.api?.propsUpdated();
  };
  return (
    <ReactDataGrid
      style={{ height: "100%", width: "100%" }}
      id="bigGrid"
      gridOptions={{
        dataProvider,
        isLoading: loading,
        uniqueIdentifierOptions: {
          useField: "id",
        },
        eventBus: {
          onApiContextReady: (ctx) => {
            apiRef.current = ctx;
          },
        },
        paginationOptions: {
          pageSize: 1000,
        },
        rowHeight,
        adapter: useMaterialAdapter ? materialAdapter : undefined,
        nodePropsFunction: useMaterialAdapter
          ? materialNodePropsFunction(theme)
          : undefined,
        enablePaging: true,
        selectionMode: GridSelectionMode.MultipleRows,
        behaviors: [
          createFilterBehavior({ clearSelectionOnFilter: true }),
          createEditBehavior({}),
          createPdfBehavior({}),
          createExcelBehavior({}),
        ],
        toolbarOptions: {
          enablePdf: true,
          enableExcel: true,
          rightToolbarRenderer: () => (
            <div className="euxdt-dg-toolbar-section">
              <button
                onClick={() => {
                  setUseMaterialAdapter(!useMaterialAdapter);
                }}
              >
                Toggle MUI Adapter
              </button>
              <IconButton
                sx={{ ml: 1 }}
                onClick={toggleRowHeights}
                color="inherit"
              >
                <Expand />
              </IconButton>
            </div>
          ),
        },
        settingsOptions: {
          settingsStorageKey: "material-grid",
        },
        columns: [
          {
            ...createDragColumn(),
            lockMode: LockMode.Left,
          },
          {
            ...createSelectionColumn({
              itemRenderer: SelectionCheckBoxRenderer,
              headerRenderer: SelectionCheckBoxHeaderRenderer,
            }),
          },

          {
            ...createColumn("id"),
            headerText: "Invoice Number",
            lockMode: LockMode.Left,
            footerOptions: {
              footerOperation: FooterOperation.Count,
              
            },
            headerOptions: {
              headerTooltip:
                "Invoice Number is the unique identifier for the invoice. It is a 6 digit number. For example, 123456.",
            },
            width: 125,
            textAlign: "center",
            filterOptions: createTextInputFilterOptions(
              FilterOperation.BeginsWith
            ),
          },
          {
            ...createColumn("invoice.hasPdf", "boolean", "Pdf?"),
            filterOptions: createTriStateCheckBoxFilterOptions(),
            width: 50,
          },

          {
            ...createColumn("lineItemAmount", "currency"),
            textAlign: "right",
            headerText: "Line Item Amount",
            filterOptions: createNumericRangeFilterOptions(),
            footerOptions: {
              footerOperation: FooterOperation.Max,
              
            },
          },
          {
            ...createColumn(
              "invoice.invoiceStatus.name",
              "string",
              "Invoice Status"
            ),
            filterOptions: createSelectFilterOptions(),
          },
          {
            ...createColumn("invoice.invoiceDate", "date", "Invoice Date"),
            filterOptions: createDateFilterOptions([
              DateRangeType.LastYear,
              DateRangeType.LastMonth,
              DateRangeType.LastWeek,
              DateRangeType.Today,
              DateRangeType.ThisWeek,
              DateRangeType.ThisMonth,
              DateRangeType.ThisYear,
              DateRangeType.NextYear,
              DateRangeType.NextMonth,
              DateRangeType.NextWeek,
              DateRangeType.Custom,
            ]),
          },

          {
            ...createColumn(
              "invoice.deal.customer.headquarterAddress.state.name",
              "string",
              "State"
            ),
            filterOptions: createMultiSelectFilterOptions(),
          },
          {
            ...createColumn(
              "invoice.deal.customer.headquarterAddress.city.name",
              "string",
              "City"
            ),
            filterOptions: {
              ...createMultiSelectFilterOptions(),
              useLabelFunctionForFilterCompare: true,
            },
          },

          {
            ...createColumn(
              "invoice.deal.customer.headquarterAddress.country.name",
              "string",
              "Country"
            ),
          },
          {
            ...createColumn(
              "lineItemDescription",
              "string",
              "Line Item Description"
            ),
            width: 300,
            filterOptions: createTextInputFilterOptions(
              FilterOperation.Contains
            ),
          },

          {
            ...createColumn(
              "invoice.deal.dealDescription",
              "string",
              "7 Deal",
              "invoice.deal.dealDescription7"
            ),
          },
          { ...createColumn("invoice.dueDate", "date", "9 Due Date") },
          {
            ...createColumn(
              "invoice.deal.dealDescription",
              "string",
              "10 Deal"
            ),
          },
          {
            ...createColumn(
              "invoice.deal.dealStatus.name",
              "string",
              "11 Deal Status"
            ),
          },
          {
            ...createColumn(
              "invoice.deal.customer.legalName",
              "string",
              "12 Customer"
            ),
          },
          {
            ...createColumn(
              "invoice.deal.customer.headquarterAddress.line1",
              "string",
              "13 Address Line 1"
            ),
          },
          {
            ...createColumn(
              "invoice.deal.customer.headquarterAddress.line2",
              "string",
              "14 Address Line 2"
            ),
          },
          {
            ...createColumn(
              "invoice.deal.customer.annualRevenue",
              "currency",
              " Revenue"
            ),
            headerOptions: {
              columnGroupText: "Financials",
              columnGroupTooltip:
                "This is the Financials group header. It contains the following columns: Revenue, Employees, EPS, Stock",
            },
            width: 90,
            children: [
              {
                ...createColumn(
                  "invoice.deal.customer.numEmployees",
                  "number",
                  " Employees"
                ),
                width: 90,
              },
              {
                ...createColumn(
                  "invoice.deal.customer.earningsPerShare",
                  "number",
                  "EPS"
                ),
                width: 90,
              },
              {
                ...createColumn(
                  "invoice.deal.customer.lastStockPrice",
                  "number",
                  "Stock "
                ),
                width: 90,
              },
            ],
          },
        ],
      }}
    />
  );
};
