Welcome to React DataGrid

The MOST Powerful DataGrid/DataTable/Tree Table component for React based Line Of Business Applications

Print, Word/Excel Export, Server/Client Paging and Filtering, Customizable Filter Controls and Summary Footers, User Settings, Preference Persistence

Smooth scroll, Nested Hierarchical Tree/child grids, Left/Right Locked Columns, Lazy Load/Virtual Scroll

Visit us at:

http://www.reactdatagrid.com/

Instructions

* Instruction Video : https://www.youtube.com/watch?v=sO3o0zG93fM
* Running example : https://www.webpackbin.com/bins/-Kj9JhCTXC3CghFUfRtQ
* Code : https://github.com/flexicious/react-datagrid-getting-started 

1) npm install 
2) npm start  
Sample code:
```
 <div>
      <h1>Hello World!</h1>
      <ReactDataGrid width={"100%"} editable dataProvider={[{ label: "Company A", state: "NJ", rank: "1.11" },
      { label: "Company B", state: "PA", rank: "11.1" },
      { label: "Company C", state: "CT", rank: "-111" },
      { label: "Company D", state: "NY", rank: "2.34" },
      { label: "Company E", state: "NJ", rank: "22.2" }]}>
        <ReactDataGridColumn dataField="label" />
        <ReactDataGridColumn dataField="state" />
        <ReactDataGridColumn dataField="rank" sortNumeric />
      </ReactDataGrid>
    </div>
