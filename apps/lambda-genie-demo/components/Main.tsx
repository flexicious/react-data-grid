import { ColumnOptions } from '@ezgrid/grid-core';
import { AppBar, CircularProgress, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CONFIG, GridConfig } from '../shared/lambda-genie/config-bindings';
import { SchoolsDataGrid } from './SchoolsDataGrid';
export const Main = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [gridConfig, setGridConfig] = useState<GridConfig>();
  const [gridColumnConfig, setGridColumnConfig] = useState<ColumnOptions[]>();

  useEffect(() => {
    const configLoader = async () => {
      const configValue = await fetch("/api/config").then((r) => r.json());
      setGridConfig(configValue[CONFIG.LAMBDA_CONFIGS.GET_SCHOOL_DETAILS.GRID_DEFINITION] as unknown as GridConfig);
      setGridColumnConfig(configValue[CONFIG.LAMBDA_CONFIGS.GET_SCHOOL_DETAILS.GRID_COLUMN_DEFINITION] as unknown as ColumnOptions[]);
      setLoading(false);
    };
    configLoader();
  }, []);
  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>

      <AppBar position="absolute" >
        <Toolbar
          sx={{
            gap: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            California School SAT Performance and Poverty Data Sample with Lambda Genie, NextJS, SQL Builder with PostgreSQL, React, and Material-UI
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack style={{ height: "100%", display: "flex", flexDirection: "column" }}>

        <div style={{ height: "50px" }}></div>
        <div className="container" style={{ flexGrow: 1 }}>
          {loading && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <CircularProgress /></div>}
          {!loading && <SchoolsDataGrid gridConfig={gridConfig} gridColumnConfig={gridColumnConfig} />}
        </div>
      </Stack>
    </div>
  );
}

