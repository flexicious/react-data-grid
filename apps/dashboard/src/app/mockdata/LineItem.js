import BaseEntity from "./BaseEntity";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class LineItem extends BaseEntity {
  constructor() {
    super();
    this.invoice = null;
    this.lineItemAmount = null;
    this.lineItemDescription = null;
    this.units = null;
  }

  getClassNames() {
    return ["LineItem", "BaseEntity"];
  }

  createNew() {
    return new LineItem();
  }

  getParent() {
    return this.invoice;
  }

  setParent(val) {
    this.invoice = val;
  }
}
