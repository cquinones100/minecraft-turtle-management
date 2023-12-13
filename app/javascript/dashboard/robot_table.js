import Robot from "./robot";
import { Component } from "../frontend";

class RobotTable extends Component {
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
