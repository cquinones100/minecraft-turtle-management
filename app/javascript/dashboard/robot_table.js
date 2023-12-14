import Robot from "./robot";
import { Component } from "../frontend";

class RobotTable extends Component {
  constructor(robots) {
    super();

    this.robots = robots.map((robot) => {
      return new Robot(robot);
    });
  }

  body() {
    return this.html`
      <table id="robot-table" class="table">
        <tbody>
          <tr>
            <th scope="col"></th>
            <th scope="col">Robot Id</th>
            <th scope="col">Coordinates</th>
            <th scope="col">Direction</th>
            <th scope="col">Actions</th>
          </tr>
          ${this.robots}
        </tbody>
      </table>
    `;
  }

  addRobot({ robot_id, status, ...rest }) {
    const robot = this.robots.find((robot) => robot.id == robot_id);

    robot.setStatus(status);

    if (!robot.isMounted()) {
      robot.mount(document.querySelector("#robot-table tbody"));
    }
  }
}

export default RobotTable;
