import { GridSelectionMode, HorizontalScrollMode } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import React, { useEffect } from "react";
import { AntDesignDemo } from "../examples/antd-demo";
import { AutoSizingGrid } from "../examples/auto-sizing-grid";
import { CellFormatting } from "../examples/cell-formatting";
import { ColumnLockModes } from "../examples/column-lock-modes";
import { ColumnMenu } from "../examples/column-menu";
import { ColumnWidthModes } from "../examples/column-width-mode";
import { ContextMenu } from "../examples/context-menu";
import { CssStyling } from "../examples/css-styling";
import { CustomToolbar } from "../examples/custom-toolbar";
import { DragDrop } from "../examples/drag-drop";
import { DynamicColumns } from "../examples/dynamic-columns";
import { EditOptions } from "../examples/edit-options";
import { FilterBuilderDemo } from "../examples/filter-builder";
import { FilterOptions } from "../examples/filter-options";
import { FooterOptions } from "../examples/footer-options";
import { GroupHeaders } from "../examples/group-headers";
import { Grouping } from "../examples/grouping-grid";
import { HeaderRenderer } from "../examples/header-renderer";
import { ItemRenderers } from "../examples/item-renderers";
import { LargeDynamicGrid } from "../examples/large-dynamic-grid";
import { LevelRenderer } from "../examples/level-renderer";
import { LevelRendererLocked } from "../examples/level-renderer-locked";
import { MaterialFilterDemo } from "../examples/material-custom-filters";
import { MaterialDemo } from "../examples/material-demo";
import { MaterialEditors } from "../examples/material-editors";
import { NestedGrid } from "../examples/nested-grid";
import { NestedLazyLoadGrid } from "../examples/nested-lazy-load";
import { PersistentSettings } from "../examples/persistent-settings";
import { RapidUpdates } from "../examples/rapid-updates";
import { LockedRows } from "../examples/row-lock-mode";
import { SaveAsYouGo } from "../examples/save-as-you-go";
import { SelectionCascade } from "../examples/selection-cascade";
import { SelectionModes } from "../examples/selection-modes";
import { ServerPaging } from "../examples/server-paging";
import { SingleLevel } from "../examples/single-level";
import { SortOptions } from "../examples/sort-options";
import { StandAloneTreeView } from "../examples/standalone-tree-view";
import { VariableRowHeight } from "../examples/variable-row-height";
import {GridBuilder} from "../examples/grid-builder";
import { PageScroll } from "../examples/page-scroll";

function Dashboard() {
  const examples = [
    { name: "Single Level" },
    { name: "Nested Grid" },
    { name: "Grouping" },
    { name: "Page Scroll" },
    { name: "Level Renderer" },
    { name: "Level Renderer Locked" },
    { name: "Ant Design Demo" },
    { name: "Material Demo" },
    { name: "Material Custom Filters" },
    { name: "Material Editors" },
    { name: "Cell Formatting" },
    { name: "CSS Styling" },
    { name: "Grid Builder" },
    { name: "Item Renderers" },
    { name: "Header Renderer" },
    { name: "Footer Options" },
    { name: "Filter Options" },
    { name: "Filter Builder" },
    { name: "Edit Options" },
    { name: "Sort Options" },
    { name: "Custom Toolbar" },
    { name: "Large Dynamic Grid" },
    { name: "Variable Row Height" },
    { name: "Context Menu" },
    { name: "Column Menu" },
    { name: "Nested Lazy Load" },
    { name: "Server Paging" },
    { name: "Selection Cascade" },
    { name: "Group Headers" },
    { name: "Selection Modes" },
    { name: "Dynamic Columns" },
    { name: "Rapid Updates" },
    { name: "Column Width Mode" },
    { name: "Column Lock Modes" },
    { name: "Persistent Settings" },
    { name: "Save As You Go" },
    { name: "Row Lock Mode" },
    { name: "Drag Drop" },
    { name: "Standalone Tree View" },
    { name: "Auto Sizing Grid" },
  ];
  let [currentRoute, setCurrentRoute] = React.useState("Single Level");
  useEffect(() => {
    const route = window.location.search.split("=")[1];
    route && setCurrentRoute(route.replace(/_/g, " "));
  }, []);
  return (
    <div className="container">
      <nav className="left-nav">
        <ReactDataGrid
          style={{ width: "100%", height: "100%" }}
          gridOptions={{
            dataProvider: examples,
            horizontalScroll: HorizontalScrollMode.Off,
            enableFooters: false,
            enableFilters: false,
            enableToolbar: false,
            enableColumnMenu: false,
            enableActiveCellHighlight: false,
            eventBus: {
              onRowSelectionChanged(selection, trigger?) {
                if (selection.length > 0) {
                  setCurrentRoute((selection as string[])[0]);
                }
              },
            },
            uniqueIdentifierOptions: {
              useField: "name",
            },
            selectionMode: GridSelectionMode.SingleRow,
            columns: [
              {
                headerText: "Select Demo",
                dataField: "name",
                uniqueIdentifier: "name",
                enableSort: false,
                enableResize: false,
                enableMove: false,
                enableCellClickRowSelect: true,
              },
            ],
          }}
        ></ReactDataGrid>
      </nav>
      <div className="right-area">
        <header>
          <h2>Welcome to React DataGrid!</h2>
          <select
            className="select-demo"
            value={currentRoute}
            onChange={(e) => setCurrentRoute(e.target.value)}
          >
            {examples.map((example) => {
              return (
                <option key={example.name} value={example.name}>
                  {example.name}
                </option>
              );
            })}
          </select>
        </header>
        <main className="display-area">
          {currentRoute === "Single Level" && <SingleLevel />}
          {currentRoute === "Nested Grid" && <NestedGrid />}
          {currentRoute === "Server Paging" && <ServerPaging />}
          {currentRoute === "Grouping" && <Grouping />}
          {currentRoute === "Page Scroll" && <PageScroll />}
          {currentRoute === "Level Renderer" && <LevelRenderer />}
          {currentRoute === "Level Renderer Locked" && <LevelRendererLocked />}
          {currentRoute === "Variable Row Height" && <VariableRowHeight />}
          {currentRoute === "Nested Lazy Load" && <NestedLazyLoadGrid />}
          {currentRoute === "Selection Cascade" && <SelectionCascade />}
          {currentRoute === "Cell Formatting" && <CellFormatting />}
          {currentRoute === "CSS Styling" && <CssStyling />}
          {currentRoute === "Item Renderers" && <ItemRenderers />}
          {currentRoute === "Header Renderer" && <HeaderRenderer />}
          {currentRoute === "Footer Options" && <FooterOptions />}
          {currentRoute === "Filter Options" && <FilterOptions />}
          {currentRoute === "Filter Builder" && <FilterBuilderDemo />}
          {currentRoute === "Edit Options" && <EditOptions />}
          {currentRoute === "Sort Options" && <SortOptions />}
          {currentRoute === "Selection Modes" && <SelectionModes />}
          {currentRoute === "Dynamic Columns" && <DynamicColumns />}
          {currentRoute === "Rapid Updates" && <RapidUpdates />}
          {currentRoute === "Column Width Mode" && <ColumnWidthModes />}
          {currentRoute === "Column Lock Modes" && <ColumnLockModes />}
          {currentRoute === "Persistent Settings" && <PersistentSettings />}
          {currentRoute === "Save As You Go" && <SaveAsYouGo />}
          {currentRoute === "Row Lock Mode" && <LockedRows />}
          {currentRoute === "Drag Drop" && <DragDrop />}
          {currentRoute === "Standalone Tree View" && <StandAloneTreeView />}
          {currentRoute === "Auto Sizing Grid" && <AutoSizingGrid />}
          {currentRoute === "Ant Design Demo" && <AntDesignDemo />}
          {currentRoute === "Material Demo" && <MaterialDemo />}
          {currentRoute === "Material Custom Filters" && <MaterialFilterDemo />}
          {currentRoute === "Custom Toolbar" && <CustomToolbar />}
          {currentRoute === "Context Menu" && <ContextMenu />}
          {currentRoute === "Column Menu" && <ColumnMenu />}
          {currentRoute === "Material Editors" && <MaterialEditors />}
          {currentRoute === "Group Headers" && <GroupHeaders />}
          {currentRoute === "Large Dynamic Grid" && <LargeDynamicGrid />}
          {currentRoute === "Grid Builder" && <GridBuilder />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
