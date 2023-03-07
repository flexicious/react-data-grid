import Organization from "./Organization";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class CustomerOrganization extends Organization {
  constructor() {
    super();
    this.billingAddress = null;
    this.deals = [];
  }

  getClassNames() {
    return ["CustomerOrganization", "Organization", "BaseEntity"];
  }

  createNew() {
    return new CustomerOrganization();
  }
}
