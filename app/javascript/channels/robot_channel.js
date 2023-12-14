import consumer from "channels/consumer"

function start(robotTable) {
  const channel = "RobotChannel";
  const dashboard = true;

  return consumer.subscriptions.create({
    channel,
    dashboard,
  }, {
    connected() {},
  
    disconnected() {
      this.perform("disconnect");
    },
  
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

              const robot = robotTable
                .robots.find(robot => robot.id == robot_id)

              robot.setCoordinates(coordinates);
              robot.setDirection(direction);

              break;
          }
        }
      }
    },

    addRobot({ robot_id, status }) {
      robotTable.addRobot({ robot_id, status });
    },

    removeRobot({ robot_id, status }) {
      robotTable
        .robots.find(robot => robot.id == robot_id)
        .setStatus(status);
    },

    completeAction(robot_id, action) {
      robotTable
        .robots
        .find(robot => robot.id == robot_id)[`${action}Completed`]();
    },
  });
}

export default start;
