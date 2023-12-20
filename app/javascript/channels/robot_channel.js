//@ts-check

import consumer from "./consumer"

/**
 * @param {import("../dashboard/robot_table").default} robotTable
 * @param {HTMLElement} [container]
 */
function start(robotTable, container) {
  const channel = "RobotChannel";
  const dashboard = true;

  return consumer.subscriptions.create({
    channel,
    dashboard,
  }, {
    connected() {
      robotTable.mount(container);
    },
  
    disconnected() {
      this.perform("disconnect");
    },
  
    received({ type, id: robot_id, status, coordinates, direction, busy }) {
      if (type) {
        if (robot_id !== null && robot_id !== undefined) {
          switch (type) {
            case "acknowledgement":
              this.addRobot({
                robot_id,
                status,
                coordinates,
                direction,
                busy
              });

              break;
            case "unsubscribed":
              this.removeRobot({ robot_id });

              break;
          }
        }
      }
    },

    /**
     * @param {import("../dashboard/robot").RobotProps} robotProps
     */
    addRobot(robotProps) {
      robotTable.addRobot(robotProps);
    },

    removeRobot({ robot_id }) {
      robotTable.removeRobot({ robot_id });
    },
  });
}

export default start;
