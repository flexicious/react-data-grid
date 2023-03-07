import BaseEntity from "./BaseEntity";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class Person extends BaseEntity {
  constructor() {
    super();
    this.firstName = null;
    this.lastName = null;
    this.telephone = null;
    this.homeAddress = null;
  }

  getClassNames() {
    return ["BaseEntity", "Person"];
  }

  getDisplayName() {
    return `${this.firstName} ${this.lastName}`;
  }

  createNew() {
    return new Person();
  }
}
