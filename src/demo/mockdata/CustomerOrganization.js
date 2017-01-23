import Organization from './Organization'
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class CustomerOrganization extends Organization {
    constructor() {
        super();
    	this.billingAddress=null;
        this.deals=[];
    }

    static getClassNames() {
        return ["CustomerOrganization","Organization","BaseEntity"];
    }

    static createNew() {
        return new CustomerOrganization();
    }
}

CustomerOrganization.prototype.typeName = CustomerOrganization.typeName = 'CustomerOrganization';//for quick inspection
flexiciousNmsp.CustomerOrganization = CustomerOrganization;
