// @ts-check

import { Component } from "../frontend";
import Work from "./work";

class WorkTable extends Component {
  /**
   * @param {import("./work").WorkProps[]} works
   */
  constructor(works) {
    super();

    this.works = works;
  }

  body() {
    return this.html`
      <table id="work-table" class="table">
        <tbody>
          <tr>
            <th scope="col">Robot Id</th>
            <th scope="col">Worker Name</th>
            <th scope="col">Messages</th>
            <th scope="col">Completed</th>
          </tr>
          ${this.workRows()}
        </tbody>
      </table>
    `
  }

  workRows() {
    return this.works.map(work => {
      return new Work(work);
    });
  }
}

export default WorkTable;
