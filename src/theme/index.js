// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

// theme
import createMuiTheme, {
  Theme as MuiTheme,
  // ThemeOptions as MuiThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";
/* local */

// theme
import palette, { extendPalette, Palette } from "./palette";
import typography from "./typography";
// import overrides from "./overrides";

// ----------------------------------------------------------------------------
// Config

const baseTheme = {
  palette,
  typography,
};

// ----------------------------------------------------------------------------

export const extendTheme = (theme = MuiTheme) => {
  return {
    ...theme,
    palette: extendPalette(theme.palette),
    // overrides: {
    //   MuiFormHelperText: {
    //     root: {
    //       fontSize: 12
    //     }
    //   },
    //   MuiSelect: {
    //     select: {
    //       "&:focus": {
    //         backgroundColor: "transparent"
    //       }
    //     }
    //   },
    //   MuiDrawer: {
    //     root: {
    //       zIndex: '2147483448 !important'
    //     }
    //   },
    //   MuiPopover: {
    //     root: {
    //       zIndex: '2147483448 !important'
    //     }
    //   }
    // }
  };
};

export default extendTheme(createMuiTheme(baseTheme));
export const themeWithRtl = extendTheme(
  createMuiTheme({ ...baseTheme, direction: "rtl" })
);
