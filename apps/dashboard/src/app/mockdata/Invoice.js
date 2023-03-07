import BaseEntity from "./BaseEntity";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class Invoice extends BaseEntity {
  constructor() {
    super();
    this.lineItems = [];
    this.deal = null;
    this.invoiceDate = null;
    this.dueDate = null;
    this.invoiceStatus = null;
    this.lineItems = [];
    this.hasPdf = true;
  }

  getClassNames() {
    return ["Invoice", "BaseEntity"];
  }

  get invoiceNumber() {
    return this.id;
  }

  get invoiceAmount() {
    let total = 0;

    for (const lineItem of this.lineItems) {
      total += lineItem.lineItemAmount;
    }

    return total;
  }

  createNew() {
    return new Invoice();
  }

  getChildren() {
    return this.lineItems;
  }

  getParent() {
    return this.deal;
  }

  setParent(val) {
    this.deal = val;
  }

  getName() {
    return this.id;
  }
}
