class Component {
  html(strings, ...values) {
    const template = document.createElement('template');
    const onClicks = [];
    const childrenGroups = []

    template.innerHTML = strings.reduce((acc, str, i) => {
      acc += str;

      if (values[i] !== undefined && values[i] !== null) {
        if (typeof values[i] == "function") {
          onClicks.push(values[i]);

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

    this.addClicks(template.content.children[0], onClicks);

    this.addChildrenGroups(template.content.children[0], childrenGroups);

    return template.content.children[0];
  }

  render() {
    return this.body();
  }

  addClicks(element, onClicks) {
    if (onClicks.length == 0) {
      return;
    }
  
    if (element.hasAttribute("onclick")) {
      const onClick = onClicks.shift();
  
      element.addEventListener("click", (e) => {
        onClick(e);
      });
  
      element.removeAttribute("onclick");
    }
  
    for (let child of element.children) {
      this.addClicks(child, onClicks);
    }
  }

  addChildrenGroups(element, childrenGroups) {
    if (childrenGroups.length == 0) {
      return;
    }

    if (element.childNodes.length == 0) {
      return;
    }

    for (let child of element.childNodes) {
      if (child.nodeType == Node.COMMENT_NODE) {
        if (child.nodeValue == "child-container") {
          const childrenGroup = childrenGroups.shift();

          for (let child of childrenGroup) {
            element.appendChild(child.render());
          }
        }
      }
    }

    for (let child of element.children) {
      this.addChildrenGroups(child, childrenGroups);
    }
  }

  mount(container) {
    container.appendChild(this.render());
  }
}

export { Component };
