import { AppBar, Stack, Toolbar, Typography } from '@mui/material';
import { QuakesDg } from './QuakesDg';
export const Main = () => {

  return (
    <div className="App" style={{height:"100vh", width:"100vw"}}>

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
            California School SAT Performance and Poverty Data Sample with NextJS, Raw SQL, React, and Material-UI
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack style={{height:"100%", display:"flex", flexDirection:"column"}}>

      <div style={{ height: "50px" }}></div>
        <div className="container" style={{flexGrow:1}}>
          <QuakesDg />
        </div>
      </Stack>
    </div>
  );
}

