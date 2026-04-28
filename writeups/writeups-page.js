import { portfolio } from "../content.js";
import { initCommandPalette } from "../js/command-palette.js";
import { initTheme } from "../js/theme.js";
import { initWriteups } from "../js/writeups.js";

document.addEventListener("DOMContentLoaded", () => {
  initCommandPalette();
  initWriteups(portfolio, { loadOnMobile: true });
  initTheme();
});
