//@ts-check

class Component {
  constructor() {
    this.stateValues = {};

    /**
     * The component's html element.
     * @type {HTMLElement | null}
     */ 
    this.element = null;
  }

  /**
   * @param {TemplateStringsArray} strings
   * @param {(function|string|number|boolean|Component|Component[])[]} values
   */
  html(strings, ...values) {
    const template = document.createElement('template');
    const onClicks = [];
    const childrenGroups = [];

    const string = strings.reduce((acc, str, i) => {
      acc += str;

      if (values[i] !== undefined && values[i] !== null) {
        if (typeof values[i] == "function") {
          onClicks.push(values[i]);
          acc += "theOnClick";

          return acc;
        }

        if (typeof values[i] == "object") {
          acc += "<!--child-container-->";

          childrenGroups.push(values[i]);

          return acc;
        }

        return acc + values[i].toString();
      } else {
        return acc;
      }
    }, "");
    template.innerHTML = string;

    this.element = /** @type {HTMLElement} */ (template.content.children[0]);

    this.addClicks(this.element, onClicks);

    this.addChildrenGroups(this.element, childrenGroups);

    if (this.element.tagName == "BUTTON") {
      if (this.element.getAttribute("disabled") == "false") {
        this.element.removeAttribute("disabled");
      }
    }

    return this.element;
  }

  render() {
    /** @type {unknown} */
    const unknownBody = this.body();
    const body = /** @type {HTMLElement} */ (unknownBody);

    return body;
  }

  /**
   * @param {HTMLElement} element
   * @param {function[]} onClicks
   */
  addClicks(element, onClicks) {
    if (onClicks.length == 0) {
      return;
    }
  
    if (element.hasAttribute("onclick")) {
      const onClick = onClicks.shift();

      if (onClick == undefined) {
        return;
      }
  
      element.addEventListener("click", (e) => {
        onClick(e);
      });
  
      element.removeAttribute("onclick");
    }

    /** @type {unknown} */
    const unknown = element.children;
    const children = /** @type {HTMLElement[]} */ (unknown);

    for (let child of children) {
      this.addClicks(child, onClicks);
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {Component[][]} childrenGroups
   */
  addChildrenGroups(element, childrenGroups) {
    if (childrenGroups.length == 0) {
      return;
    }

    if (element.childNodes.length == 0) {
      return;
    }

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];

      if (child.nodeType == Node.COMMENT_NODE) {
        if (child.nodeValue == "child-container") {
          const childrenGroup = childrenGroups.shift();

          if (childrenGroup == undefined) {
            return;
          }

          for (let child of childrenGroup) {
            element.appendChild(child.render());
          }
        }
      }
    }

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];

      /** @type {unknown} */
      const unkonwnChild = child;
      const typedChild = /** @type {HTMLElement} */ (unkonwnChild);

      this.addChildrenGroups(typedChild, childrenGroups);
    }
  }

  /**
   * @param {HTMLElement} container
   */
  mount(container) {
    container.appendChild(this.render());
  }

  body() {
    throw new Error("Not implemented");
  }

  /**
   * @param {() => void} callback
   */
  setState(callback) {
    callback();

    if (this.element) {
      const element = this.element;

      this.element.parentNode?.replaceChild(this.render(), element);
    }
  }
}

export { Component };
