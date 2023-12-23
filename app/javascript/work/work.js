// @ts-check

import { Component } from "../frontend";

/**
 * @typedef {Object} WorkProps
 * @property {number} work_id
 * @property {number} robot_id
 * @property {boolean} completed
 * @property {string} worker_name
 */

class Work extends Component {
  /**
   * @param {WorkProps} props
   */
  constructor({ work_id, robot_id, completed, worker_name, messages }) {
    super();

    this.work_id = work_id;
    this.robot_id = robot_id;
    this.completed = completed;
    this.worker_name = worker_name;
    this.messages = messages;
  }

  body() {
    return this.html`
      <tr id="work-${this.work_id}">
        <td id="work-${this.work_id}-robot-id">${this.robot_id}</td>
        <td id="work-${this.worker_name}-worker-name">${this.worker_name}</td>
        <td id="work-${this.work_id}-messages">${this.messages}</td>
        <td id="work-${this.work_id}-completed">${this.completed}</td>
      </tr>
    `
  }
}

export default Work;
