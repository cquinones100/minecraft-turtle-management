import Robot from "./robot";
import { Component } from "../frontend";

class RobotTable extends Component {
  static addRobot({ robot_id, status }) {
    const robot = Robot.find(robot_id);
    robot.setStatus(status);

    if (!robot.isMounted()) {
      robot.mount(document.querySelector("#robot-table tbody"));
    }
  }

  constructor(robots) {
    super();

    this.robots = robots;
  }

  body() {
    return this.html`
      <table id="robot-table">
        <tbody>
          <tr>
            <th>Robot Id</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          ${this.robots.map((robot) => {
            return new Robot(robot, this.container);
          })}
        </tbody>
      </table>
    `;
  }
}

export default RobotTable;
