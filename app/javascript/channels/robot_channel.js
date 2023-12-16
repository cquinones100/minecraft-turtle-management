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
  
    received({ type, id: robot_id, status, coordinates, direction, ...rest }) {
      if (type) {
        if (robot_id !== null && robot_id !== undefined) {
          switch (type) {
            case "acknowledgement":
              this.addRobot({ robot_id, status, coordinates, direction });

              break;
            case "unsubscribed":
              this.removeRobot({ robot_id, status });

              break;
            case "action_completed":
              const { action } = rest;

              this.completeAction(robot_id, action);

              break;
            case "coordinates_updated":
              const robot = robotTable
                .robots.find(robot => robot.id == robot_id)

              if (!robot) {
                break;
              }

              robot.setCoordinates(coordinates);
              robot.setDirection(direction);

              break;
          }
        }
      }
    },

    addRobot({ robot_id, status, coordinates, direction }) {
      robotTable.addRobot({ robot_id, status, coordinates, direction })
    },

    removeRobot({ robot_id, status }) {
      robotTable.robots.find(robot => robot.id == robot_id)?.setStatus(status);
    },

    /**
     * @param {number} robot_id
     * @param {string} action
     */
    completeAction(robot_id, action) {
      const robot = robotTable.robots.find(robot => robot.id == robot_id);
      if (!robot) {
        return;
      }

      robot[`${action}Completed`]();
    },
  });
}

export default start;
