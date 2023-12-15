//@ts-check

import RobotTable from "./robot_table";
import Channel from "../channels/robot_channel";

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement|null} */
  const container = document.querySelector("#dashboard-container");

  if (!container) {
    throw new Error("Could not find dashboard container");
  }

  const dataRobots = container.getAttribute("data-robots");

  if (!dataRobots) {
    throw new Error("Could not find data-robots attribute on container");
  }

  const robots = JSON.parse(dataRobots)
  const robotTable = new RobotTable(robots);

  robotTable.mount(container)

  window.RobotChannel = Channel(robotTable);
});
