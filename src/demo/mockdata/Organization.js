import BaseEntity from './BaseEntity'
/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class Organization extends BaseEntity {
    constructor() {
        super()

        this.headquarterAddress = null;
        this.mailingAddress = null;
        this.legalName = null;
        this.url = null;
        this.billingContact = null;
        this.salesContact = null;
        this.annualRevenue = null;
        this.numEmployees = null;
        this.earningsPerShare = null;
        this.lastStockPrice = null;
        this.chartUrl = null;
        this.deals = [];
        this.isActive = true;
        this.headQuartersSameAsMailing = null;

    }

    getClassNames() {
        return ["Organization", "BaseEntity"];
    }

    getOrgIndex() {
        return myCompanyNameSpace.FlexiciousMockGenerator.simpleList.indexOf(this);
    }

    getRelationshipAmount() {
        let total = 0;

        for (const deal of this.deals) {
            total += deal.getDealAmount();
        }

        return total;
    }

    createNew() {
        return new Organization();

    }

    getName() {
        return this.legalName;

    }

    getChildren() {
        return this.deals;

    }
}

const uiUtil = flexiciousNmsp.UIUtils;
const flxConstants = flexiciousNmsp.Constants;
Organization.prototype.typeName = Organization.typeName = 'BaseEntity';//for quick inspection
flexiciousNmsp.Organization = Organization;
