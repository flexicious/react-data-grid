import ReferenceData from "./ReferenceData";
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class SystemConstants {
  getClassNames() {
    return ["SystemConstants"];
  }
}
SystemConstants.prototype.typeName = SystemConstants.typeName =
  "SystemConstants"; //for quick inspection
SystemConstants.usCountry = new ReferenceData(1, "United States");

SystemConstants.states = [
  new ReferenceData(1, "MI", "Michigan",[
    new ReferenceData(1, "Detroit"),
    new ReferenceData(2, "Grand Rapids"),
    new ReferenceData(3, "Lansing"),
    new ReferenceData(4, "Flint"),
  ]),
  new ReferenceData(2, "NY", "New York",[
    new ReferenceData(1, "New York"),
    new ReferenceData(2, "Buffalo"),
    new ReferenceData(3, "Rochester"),
    new ReferenceData(4, "Yonkers"),
  ]),
  new ReferenceData(3, "PA", "Pennsylvania",[
    new ReferenceData(1, "Philadelphia"),
    new ReferenceData(2, "Pittsburgh"),
    new ReferenceData(3, "Allentown"),
    new ReferenceData(4, "Erie"),
  ]),

  new ReferenceData(4, "NJ",  "New Jersey",[
    new ReferenceData(1, "Newark"),
    new ReferenceData(2, "Jersey City"),
    new ReferenceData(3, "Paterson"),
    new ReferenceData(4, "Elizabeth"),
  ]),
  new ReferenceData(5, "OH", "Ohio",[
    new ReferenceData(1, "Columbus"),
    new ReferenceData(2, "Cleveland"),
    new ReferenceData(3, "Cincinnati"),
    new ReferenceData(4, "Toledo"),
  ]),
  new ReferenceData(6, "NC",  "North Carolina",[
    new ReferenceData(1, "Charlotte"),
    new ReferenceData(2, "Raleigh"),
    new ReferenceData(3, "Greensboro"),
    new ReferenceData(4, "Winston-Salem"),
  ]),
];

SystemConstants.dealStatuses = [
  new ReferenceData(1, "Prospect"),
  new ReferenceData(2, "Qualified"),
  new ReferenceData(3, "In Process"),
  new ReferenceData(4, "Cancelled"),
  new ReferenceData(5, "Complete"),
];

SystemConstants.invoiceStatuses = [
  new ReferenceData(1, "Draft"),
  new ReferenceData(2, "Approved"),
  new ReferenceData(3, "Transmitted"),
  new ReferenceData(4, "Paid"),
  new ReferenceData(5, "Cancelled"),
];

SystemConstants.billableConsultants = [
  new ReferenceData(1, "Jason Bourne"),
  new ReferenceData(2, "Lars Wilson"),
  new ReferenceData(3, "Tarah Silverman"),
  new ReferenceData(4, "Betty White"),
  new ReferenceData(5, "Kristian Donovan"),
];
