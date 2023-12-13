import consumer from "channels/consumer"
import Robot from "../dashboard/robot";
import RobotTable from "../dashboard/robot_table";

function start() {
  const channel = "RobotChannel";
  const dashboard = true;

  return consumer.subscriptions.create({
    channel,
    dashboard,
  }, {
    connected() {},
  
    disconnected() {},
  
    received({ type, id: robot_id, ...rest }) {
      if (type) {
        if (robot_id !== null && robot_id !== undefined) {
          const { status } = rest;

          switch (type) {
            case "acknowledgement":
              this.addRobot({ robot_id, status });

              break;
            case "unsubscribed":
              this.removeRobot({ robot_id, status });

              break;
            case "action_completed":
              const { action } = rest;

              this.completeAction(robot_id, action);

              break;
            case "coordinates_updated":
              const { coordinates, direction } = rest;
              const { x, y, z } = coordinates;

              console.log(`coordinates: { x: ${x}, y: ${y}, z: ${z} }, direction: ${direction}`);

              break;
          }
        }
      }
    },

    addRobot({ robot_id, status }) {
      RobotTable.addRobot({ robot_id, status });
    },

    removeRobot({ robot_id, status }) {
      Robot.find(robot_id).setStatus(status);
    },

    completeAction(robot_id, action) {
      Robot.find(robot_id)[`${action}Completed`]();
    },
  });
}

export default start;
