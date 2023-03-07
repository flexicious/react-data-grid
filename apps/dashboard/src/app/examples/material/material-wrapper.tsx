import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Box, IconButton, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, ReactNode, useMemo, useState } from "react";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const MaterialWrapper = ({ demo }: { demo: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
          }}
          style={{ height: "100%", width: "100%" }}
        >
          <div
            style={{
              alignSelf: "end",
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>MUI Theme: </Typography>
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </div>
          {demo}
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
