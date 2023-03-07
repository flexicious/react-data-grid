import BaseEntity from "./BaseEntity";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class ReferenceData extends BaseEntity {
  constructor(id, code, name, children) {
    //constructor
    super();
    if (typeof name === "undefined") name = null;
    //properties
    this.code = code;
    this.id = id;
    if (!name) name = code;
    this.name = name;
    this.children = children;
  }

  getClassNames() {
    //support for is/as
    return ["ReferenceData"];
  }

  cloneSpecial() {
    const ref = new ReferenceData(this.id, this.code, this.name, this.children);
    return ref;
  }

  createNew() {
    return this.cloneSpecial();
  }
}
