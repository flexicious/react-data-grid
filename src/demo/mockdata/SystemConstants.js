import ReferenceData from './ReferenceData'
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
/**
 * When is actionscript getting ENUMS!!
 */
export default class SystemConstants {
    getClassNames() {
        return ["SystemConstants"];
    }
}
SystemConstants.prototype.typeName = SystemConstants.typeName = 'SystemConstants';//for quick inspection
SystemConstants.usCountry = new ReferenceData(1, "United States");
SystemConstants.cities = [new ReferenceData(1, 'Grand Rapids'),
new ReferenceData(2, 'Albany'),
new ReferenceData(3, 'Stroudsburgh'),
new ReferenceData(4, 'Barrie'),
new ReferenceData(5, 'Springfield')];
SystemConstants.states =
    [new ReferenceData(1, 'MI', 'Michigan'),
    new ReferenceData(2, 'NY', 'New York'),
    new ReferenceData(3, 'PA', 'Penn'),
    new ReferenceData(4, 'NJ', 'New Jersey'),
    new ReferenceData(5, 'OH', 'Ohio'),
    new ReferenceData(6, 'NC', 'North Carolina')];

SystemConstants.dealStatuses = [
    new ReferenceData(1, 'Prospect'),
    new ReferenceData(2, 'Qualified'),
    new ReferenceData(3, 'In Process'),
    new ReferenceData(4, 'Cancelled'),
    new ReferenceData(5, 'Complete')
];

SystemConstants.invoiceStatuses = [
    new ReferenceData(1, 'Draft'),
    new ReferenceData(2, 'Approved'),
    new ReferenceData(3, 'Transmitted'),
    new ReferenceData(4, 'Paid'),
    new ReferenceData(5, 'Cancelled')
];

SystemConstants.billableConsultants = [
    new ReferenceData(1, 'Jason Bourne'),
    new ReferenceData(2, 'Lars Wilson'),
    new ReferenceData(3, 'Tarah Silverman'),
    new ReferenceData(4, 'Betty White'),
    new ReferenceData(5, 'Kristian Donovan')];

flexiciousNmsp.SystemConstants = SystemConstants;
