import Person from "./Person";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class SystemUser extends Person {
  constructor() {
    super();
    this.loginNm = null;
  }

  getClassNames() {
    return ["BaseEntity", "Person", "SystemUser"];
  }

  createNew() {
    return new SystemUser();
  }
}
