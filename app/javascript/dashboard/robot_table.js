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

    this.robots = robots;
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
          ${this.robotRows()}
        </tbody>
      </table>
    `;
  }

  /**
    * @param {import("./robot").RobotProps} robot
    */
  addRobot(robot) {
    const newRobots = [];
    let robotFound = false;

    for (const thisRobot of this.robots) {
      if (thisRobot.robot_id == robot.robot_id) {
        newRobots.push(robot);

        robotFound = true;
      } else {
        newRobots.push(thisRobot);
      }
    }

    if (!robotFound) {
      newRobots.push(robot);
    }

    this.setState(() => {
      this.robots = newRobots;
    });
  }

  robotRows() {
    return this.robots.map((robot) => {
      return new Robot(robot);
    });
  }

  removeRobot({ robot_id }) {
    this.setState(() => {
      this.robots = this.robots.map((robot) => {
        if (robot.robot_id !== robot_id) {
          robot.status = "offline";
        }

        return robot;
      }, []);
    });
  }
}

export default RobotTable;
