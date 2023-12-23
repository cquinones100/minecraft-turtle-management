//@ts-check

import WorkTable from "./work_table";
import Channel from "../channels/work_channel";

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement|null} */
  const container = document.querySelector("#work-container");

  if (!container) {
    throw new Error("Could not find work container");
  }

  const dataWorks = container.getAttribute("data-works");

  if (!dataWorks) {
    throw new Error("Could not find data-works attribute on container");
  }

  const works = JSON.parse(dataWorks)
  const workTable = new WorkTable(works);

  window.WorkChannel = Channel(workTable, container);
});
