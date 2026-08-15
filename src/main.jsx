import React from "react";
import ReactDOM from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  responsiveFontSizes,
} from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { App } from "./app.jsx";

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
  })
);

const sortSearchParams = (search) => {
  search.sort();
  return search;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NuqsAdapter processUrlSearchParams={sortSearchParams}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </NuqsAdapter>
  </React.StrictMode>
);
