# React DataGrid 

This is a monorepo of all the samples and examples for the ReactDataGrid component. If you wish to get started with a smaller example, please see the [ReactDataGrid Starter](https://github.com/flexicious/react-datagrid-cra) repo.


## Installation

To get started, first clone the repo: 

```bash
git clone https://github.com/flexicious/react-data-grid
```

Then install the dependencies:
```bash
npm install 
```

## Running the examples

To run the examples, run the following command:

```bash
npm run start
```
### Dashboard Example App
This repo is a NX monorepo, which means it has multiple packages. The main package in this repo is the dashboard package. In this package, you will find all examples that are hosted on the [ReactDataGrid website](https://reactdatagrid.com/examples/). This is also the main package, so when you run `npm run start`, it will start the dashboard application. The dashboard application has no server side code, and is a pure React application. The api calls are mocked.

### NextJS Example App with Knex and Sqlite 
The nextjs-knex-react example is a full stack application, with a server side API, and a client side React application. The server side API is built using [NextJS](https://nextjs.org/), and the database is [Sqlite](https://www.sqlite.org/index.html). The database is managed using [Knex](http://knexjs.org/). The client side application is built using React, and uses the ReactDataGrid component. The server side API is built using [NextJS](https://nextjs.org/), and the database is [Sqlite](https://www.sqlite.org/index.html). This example demonstrates a real world application with server side paging, filtering, sorting, and even a batched export/pdf functionality. 

Additionally, this application demonstrates lazy loading of hierarchical data, so when you expand a row, it will load the child data from the server.

To run the nextjs-knex-react example, run the following commands:

```bash
npx nx serve nextjs-knex-react
```

This will start both the server side API, and the client side React application. Once the application is running, you can access the application at http://localhost:3000.


### GraphQL Example App with Apollo Server and Apollo Client
The graphql-apollo example is a full stack application, with a server side API, and a client side React application. The server side API is built using [Apollo Server](https://www.apollographql.com/docs/apollo-server/), and the database is [Sqlite](https://www.sqlite.org/index.html). The client side application is built using React, and uses the ReactDataGrid component. This example demonstrates a real world application with server side paging, filtering, sorting, and even a batched export/pdf functionality.

To run the graphql-apollo example, run the following commands:

```bash
npx nx serve graphql-apollo-react
```

This will start both the server side API, and the client side React application. Once the application is running, you can access the application at http://localhost:4200.

### SQL Builder Example App with NextJS and Sqlite
The sql-reactdatagrid example is a full stack application, built using [NextJS](https://nextjs.org/), and Reacct. The database is [Sqlite](https://www.sqlite.org/index.html). The client side application uses the ReactDataGrid component. This example demonstrates a real world application with server side paging, filtering, sorting, and even a batched export/pdf functionality.

This application demonstrates lazy loading of all data, including filter dropdowns that show distinct values for the user to pick from.
They will populate only when the user clicks no the down arrow button.

To run the sql-reactdatagrid example, run the following commands:

```bash
npx nx serve sql-react-datagrid
```

This will start both the server side API, and the client side React application. Once the application is running, you can access the application at http://localhost:3000.


### Window scroll
The window-scroll example demonstrates how to use the ReactDataGrid component with a window scroll. This example is a pure React application, with no server side code. The api calls are mocked. The ReactDataGrid component is configured to use the window as the scroll container, and the window scroll is used to scroll the grid. This ensures there is only one scroll bar, and the grid is always in sync with the window scroll. Multiple vertical scroll bars are not a good user experience, and this example demonstrates how to avoid that. What is unique about our ReactDataGrid component is that even with window scroll, the grid retains its virtualization, and only renders the rows that are visible in the window.  

To run the window-scroll example, run the following commands:

```bash
npx nx serve window-scroll
```

## Documentation
Getting Started Guide:
https://reactdatagrid.com/docs/intro
## Information


- [ReactDataGrid](https://reactdatagrid.com) is a React component for displaying tabular data, built from the ground up for 2023, by a team with [20+ years](https://reactdatagrid.com/docs/welcome#a-trip-down-the-memory-lane) of experience building datagrids.
- It integrates deeply with [Material UI](https://reactdatagrid.com/docs/welcome#material-ui-and-others), but thanks to its highly customizable rendering engine, it can be used with any UI framework, or without any UI framework at all. If you are already using Material UI, this datagrid will seamlessly integrate with your application in terms of user experience, theming, and customization.
- It is very [light weight](https://reactdatagrid.com/docs/welcome#bundle-size)  without compromising on features, thanks to a combination of [thoughtful design](https://reactdatagrid.com/docs/welcome#features),  [modern tooling & ecosystem](https://reactdatagrid.com/docs/welcome#evolution-of-webpack-tree-shaking-and-es6-modules), [plugin architecture](https://reactdatagrid.com/docs/welcome#pluggability-over-configuration), and [ES6 modules](https://reactdatagrid.com/docs/welcome#evolution-of-webpack-tree-shaking-and-es6-modules). More on this below.
- Built in React for React, with TypeScript.


