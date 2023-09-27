import { initTabs } from "./tabs.js";
import { membersMain } from "./members.js";
import { resultsMain } from "./results.js";

window.addEventListener("load", initApp);

async function initApp() {
  initTabs();
  resultsMain();
  membersMain();
  // TODO: Make the rest of the program ...
}
