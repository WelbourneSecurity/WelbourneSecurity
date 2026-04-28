import { portfolio } from "./content.js";
import { initPlatform } from "./js/platform.js";
import { initTheme } from "./js/theme.js";
import { initFootprint } from "./js/footprint.js";
import { initTools } from "./js/tools.js";
import { initCommandPalette } from "./js/command-palette.js";

document.addEventListener("DOMContentLoaded", () => {
  initPlatform(portfolio);
  initCommandPalette();
  initFootprint();
  initTools();
  initTheme();
});
