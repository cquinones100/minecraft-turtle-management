//@ts-check

import { Component } from '../frontend';
import CancelableButton from './cancelable_button';

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
 * @property {boolean} busy
 */

/** @extends {Component} */
class Robot extends Component {
  /**
   * @param {RobotProps} props
   */

  constructor({ robot_id: id, status, direction, coordinates, busy }) {
    super();

    this.id = id;
    this.status = status;
    this.direction = direction;
    this.coordinates = coordinates;
    this.busy = busy;
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
        <td id="robot-${this.id}-id">${this.id}</td>
        <td
          id="robot-${this.id}-coordinates"
        >
          ${this.getCoordinates()}
        </td>
        <td id="robot-${this.id}-direction">
          ${this.getDirection()}
        </td>
        <td>${[this.mineButton()]}</td>
        <td>${[this.moveButton('forward')]}</td>
        <td>${[this.moveButton('backward')]}</td>
        </td>
      </tr>
    `;
  }

  mineButton() {
    return new CancelableButton({
      action: `Mine`,
      robotId: this.id,
      onClick: this.mine.bind(this),
      disabled: this.busy,
    });
  }

  /**
   * @param {"forward"|"backward"} direction
   */
  moveButton(direction) {
    return new CancelableButton({
      action: `Move ${direction}`,
      robotId: this.id,
      onClick: this.move.bind(this, direction),
      disabled: this.busy,
    });
  }

  getStatus() {
    if (this.busy) {
      return "⏳";
    }

    if (this.status == "online") {
      return "🟢";
    } else {
      return "🔴";
    }
  }

  getCoordinates() {
    if (this.coordinates && this.coordinates.x && this.coordinates.y && this.coordinates.z) {
      return `
        ${this.coordinates.x},
        ${this.coordinates.y},
        ${this.coordinates.z}
      `
    } else {
      return "";
    }
  }

  getDirection() {
    return `${this.direction || ''}`
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

  /**
   * @param {"forward"|"backward"} direction
   */
  move(direction) {
    this.setState(() => {
      this.busy = true;

      window.RobotChannel.perform("move", { id: this.id, direction });
    });
  }

  mine() {
    this.setState(() => {
      this.busy = true;

      window.RobotChannel.perform("mine", { id: this.id });
    });
  }

  completeAction() {
    this.setState(() => {
      this.busy = false;
    });
  }
}

export default Robot;
