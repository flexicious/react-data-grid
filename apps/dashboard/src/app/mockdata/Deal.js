import BaseEntity from "./BaseEntity";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class Deal extends BaseEntity {
  constructor() {
    super();
    this.invoices = [];
    this.customer = null;
    this.invoices = [];
    this.dealDate = null;
    this.dealStatus = null;
    this.dealDescription = null;
    this.finalized = true;
    this.provider = null;
    this.dealContacts = null;
  }

  getClassNames() {
    return ["Deal", "BaseEntity"];
  }

  getDealAmount() {
    let total = 0;

    for (const inv of this.invoices) {
      total += inv.invoiceAmount;
    }

    return total;
  }
  get dealAmount() {
    return this.getDealAmount();
  }
  get billable() {
    return this.getIsBillable();
  }

  getIsBillable() {
    return this.dealStatus.code !== "Prospect";
  }

  createNew() {
    return new Deal();
  }

  getName() {
    return this.dealDescription;
  }

  getChildren() {
    return this.invoices;
  }

  getParent() {
    return this.customer;
  }

  setParent(val) {
    this.customer = val;
  }
}
