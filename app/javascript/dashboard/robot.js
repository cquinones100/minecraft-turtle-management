//@ts-check

import { Component } from '../frontend';

/**
 * @typedef {Object} Coordinates
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
  * @typedef {("north"|"east"|"south"|"west")} Direction
  */

/**
  * @typedef {("online"|"offline"|"error")} Status
  */

/** 
 * @typedef {Object} RobotProps
 * @property {number} robot_id
 * @property {Status} status
 * @property {Coordinates} coordinates
 * @property {Direction} direction
 */

/** @extends {Component} */
class Robot extends Component {
  /**
   * @param {RobotProps} props
   */

  constructor({ robot_id: id, status, direction, coordinates }) {
    super();

    this.id = id;
    this.status = status;
    this.direction = direction;
    this.coordinates = coordinates;
  }

  body() {
    return this.html`
      <tr id="robot-${this.id}">
        <td
          id="robot-${this.id}-status"
          style="cursor:default;"
          title="Ready to receive commands"
        >
          ${this.getStatus()}
        </td>
        <td>${this.id}</td>
        <td
          id="robot-${this.id}-coordinates"
        >
          ${this.getCoordinates()}
        </td>
        <td id="robot-${this.id}-direction">
          ${this.getDirection()}
        </td>
        <td>
          <button
            class="btn btn-primary"
            id="robot-${this.id}-move-button"
            onclick=${this.move.bind(this)}
          >
            Move
          </button>
        </td>
        <td>
          <button
            class="btn btn-primary
            id="robot-${this.id}-say_hello-button"
          >
            Say Hello
          </button>
        </td>
      </tr>
    `;
  }

  getStatus() {
    if (this.status == "online") {
      return "🟢";
    } else {
      return "🔴";
    }
  }

  move() {
    console.log(this)
    console.log(`Moving ${this.id}`);

    const moveButton = this.getMoveButton();

    moveButton.style.cursor = "wait";
    moveButton.disabled = true;

    window.RobotChannel.perform("move", { id: this.id });
  }

  moveCompleted() {
    const moveButton = this.getMoveButton();

    if (moveButton) {
      moveButton.style.cursor = "default";
      moveButton.disabled = false;
    }
  }

  getMoveButton() {
    /** @type {unknown} */
    const unknownButton = this.element?.querySelector(`#robot-${this.id}-move-button`);

    const button = /** @type {HTMLButtonElement} */ (unknownButton);

    if (!button) {
      throw new Error(`Could not find move button for robot ${this.id}`);
    } else {
      return button;
    }
  }

  getCoordinates() {
    return `
      ${this.coordinates.x},
      ${this.coordinates.y},
      ${this.coordinates.z}
    `
  }

  getDirection() {
    return `${this.direction}`
  }

  /**
    * @param {Status} status
    * @returns {void}
   */
  setStatus(status) {
    this.setState(() => {
      this.status = status;
    });
  }

  /**
   * @param {Coordinates} coordinates
   */
  setCoordinates(coordinates) {
    this.setState(() => {
      this.coordinates = coordinates;
    });
  }

  /**
   * @param {Direction} direction
   */
  setDirection(direction) {
    this.setState(() => {
      this.direction = direction;
    });
  }
}

export default Robot;
