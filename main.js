import { portfolio } from "./content.js";
import { initPlatform } from "./js/platform.js";
import { initTheme } from "./js/theme.js";
import { initFootprint } from "./js/footprint.js";
import { initWriteups } from "./js/writeups.js";
import { initTools } from "./js/tools.js";

document.addEventListener("DOMContentLoaded", () => {
  initPlatform(portfolio);
  initFootprint();
  initTools();

  const { ensureWriteupsOnDesktop } = initWriteups(portfolio);
  initTheme({ onDesktopViewport: ensureWriteupsOnDesktop });
});
