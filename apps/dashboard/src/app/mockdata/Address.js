import BaseEntity from "./BaseEntity";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class Address extends BaseEntity {
  constructor() {
    super();
    this.addressType = null;
    this.isPrimary = null;
    this.line1 = null;
    this.line2 = null;
    this.line3 = null;
    this.city = null;
    this.state = null;
    this.country = null;
    this.postalCode = null;
  }

  getClassNames() {
    return ["Address", "BaseEntity"];
  }

  createNew() {
    return new Address();
  }

  toDisplayString() {
    let ret = "";
    ret += `${this.line1} `;
    ret += `${this.line2} `;
    ret += `${this.line2}. `;
    ret += `${this.city.name}, `;
    ret += `${this.state.name}, `;
    ret += `${this.country.name} `;
    return ret;
  }
}
