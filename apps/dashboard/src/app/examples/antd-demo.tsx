import {
    ApiContext,
    createColumn,
    createDragColumn,
    createEditBehavior,
    createFilterBehavior,
    createSelectionColumn,
    DateRangeType, FilterOperation,
    FooterOperation,
    GridSelectionMode,
    LockMode
} from "@ezgrid/grid-core";
import { createExcelBehavior, createPdfBehavior } from "@ezgrid/grid-export";
import {
    createDateFilterOptions,
    createMultiSelectFilterOptions,
    createNumericRangeFilterOptions,
    createSelectFilterOptions,
    createTextInputFilterOptions,
    createTriStateCheckBoxFilterOptions,
    ReactDataGrid,
    SelectionCheckBoxHeaderRenderer,
    SelectionCheckBoxRenderer
} from "@ezgrid/grid-react";
import { useEffect, useRef, useState } from "react";
import { antAdapter } from "./ant-design-adapter";
import FlexiciousMockGenerator from "../mockdata/FlexiciousMockGenerator";
import LineItem from "../mockdata/LineItem";

export const AntDesignDemo = () => {
  const apiRef = useRef<ApiContext | null>(null);
  const [dataProvider, setDataProvider] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [useAntAdapter, setUseAntAdapter] = useState(true);
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
        adapter: useAntAdapter ? antAdapter : undefined,
        //   nodePropsFunction: useAntAdapter ? materialNodePropsFunction(theme): undefined,
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
            <div className="ezgrid-dg-toolbar-section">
              <button
                onClick={() => {
                  setUseAntAdapter(!useAntAdapter);
                }}
              >
                Toggle Ant Design Adapter
              </button>
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
