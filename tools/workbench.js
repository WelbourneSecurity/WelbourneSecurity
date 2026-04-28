import { initCommandPalette } from "../js/command-palette.js";
import { initTheme } from "../js/theme.js";
import { initTools } from "../js/tools.js";

document.addEventListener("DOMContentLoaded", () => {
  initCommandPalette();
  initTools();
  initTheme();
});
