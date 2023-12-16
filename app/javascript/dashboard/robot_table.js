// @ts-check

import Robot from "./robot";
import { Component } from "../frontend";

/**
 * @name RobotTable#setRobots
 * @function
 * @memberof RobotTable
 * @param {Robot[]} robots
 */

class RobotTable extends Component {
  /**
   * @param {import("./robot").RobotProps[]} robots
   */
  constructor(robots) {
    super();

    console.log(robots);

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

  /**
    * @param {import("./robot").RobotProps} robot
    */
  addRobot(robot) {
    const existingRobot = this.robots.find((theRobot) => 
      theRobot.id == robot.robot_id
    );

    if (existingRobot) {
      existingRobot.setStatus(robot.status);
    } else {
      const newRobots = this.robots.concat(new Robot(robot));

      this.setRobots(newRobots);
    }
  }

  /**
   * @param {Robot[]} robots
   */
  setRobots(robots) {
    this.setState(() => {
      this.robots = robots;
    });
  }
}

export default RobotTable;
