// ----------------------------------------------------------------------------
// IMPORTS

/* npm */

// styles
// import { Color } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
// import {
//   Palette as MuiPalette,
//   PaletteColor,
//   PaletteOptions as MuiPaletteOptions,
//   ColorPartial,
//   SimplePaletteColorOptions,
//   TypeText,
// } from "@material-ui/core/styles/createPalette";

// utils
// import _ from "lodash";
import deepmerge from "deepmerge";

// ----------------------------------------------------------------------------
// Config

export const THEME_COLORS = ["primary", "secondary", "tertiary", "quanternary"];
export const PALETTE_COLORS = ["black", "white", "gray"];
export const EXPERIENCE_COLORS = [
  "default",
  "error",
  "warning",
  "success",
  "info",
];

export const white = "#ffffff";

// ----------------------------------------------------------------------------

const palette_options = {
  primary: {
    contrastText: white,
    dark: "#000a12",
    main: "#263238",
    light: "#4f5b62",
    // dark: "#1b0000",
    // main: "#3e2723",
    // light: "#6a4f4b"
  },
  secondary: {
    contrastText: white,
    dark: "#babdbe",
    main: "#eceff1",
    light: "#ffffff",
    // dark: "#c2b700",
    // main: "#f9e935",
    // light: "#ffff6d",
  },
  tertiary: {
    contrastText: white,
    dark: "#6b4b43",
    main: "#9a776e",
    light: "#cca69c",
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400],
  },
  headingColor: [
    colors.red[500],
    colors.pink[500],
    colors.purple[500],
    colors.indigo[500],
    colors.lightBlue[500],
    colors.cyan[500],
    colors.green[500],
    colors.lime[500],
    colors.amber[500],
    colors.deepOrange[500],
  ],
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
  },
  link: {
    primary: colors.blue[600],
  },
  icon: {
    primary: colors.blueGrey[600],
  },
  background: {
    default: "#F4F6F8",
    paper: white,
  },
  divider: colors.grey[200],
};

export default palette_options;

// ----------------------------------------------------------------------------

export const extendPalette = (palette) => {
  return {
    ...palette,
    ...deepmerge(
      {
        // TODO: please replace this with actual defaults
        link: {
          primary: colors.blue[600],
          secondary: colors.blue[400],
          disabled: colors.blue[100],
          hint: colors.blue[300],
        },
        icon: {
          primary: colors.blue[600],
          secondary: colors.blue[400],
          disabled: colors.blue[100],
          hint: colors.blue[300],
        },
      },
      {
        link: palette.link,
        icon: palette.icon,
      }
    ),
  };
};
