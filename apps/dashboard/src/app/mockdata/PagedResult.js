import BaseEntity from "./BaseEntity";

/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class PagedResult extends BaseEntity {
  constructor(collection, totalRecords, summaryData, deepClone) {
    super();
    if (typeof totalRecords === "undefined") totalRecords = 0;
    if (typeof summaryData === "undefined") summaryData = null;
    if (typeof deepClone === "undefined") deepClone = true;

    this.collection = null;
    this.totalRecords = null;
    this.summaryData = null;

    this.collection = [];

    for (const entity of collection) {
      this.collection.push(entity.clone(deepClone));
    }

    this.totalRecords = totalRecords;
    this.summaryData = summaryData;
  }

  getClassNames() {
    return ["PagedResult"];
  }
}
