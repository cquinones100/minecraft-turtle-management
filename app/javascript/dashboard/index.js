import RobotTable from "./robot_table";
import Channel from "../channels/robot_channel";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#dashboard-container");

  const robots = JSON.parse(container.getAttribute("data-robots"));
  const robotTable = new RobotTable(robots);

  robotTable.mount(container)

  window.RobotChannel = Channel(robotTable);
});
