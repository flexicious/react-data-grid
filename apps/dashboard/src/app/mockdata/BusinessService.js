import ServiceProxyBase from "./ServiceProxyBase";
import FlexiciousMockGenerator from "./FlexiciousMockGenerator";

/**
 * This is a flex interface for a webservice or a remoting servicer.
 * @author Flexicious
 * @constructor
 * @namespace com.flexicious.example.serviceproxies
 */
export default class BusinessService extends ServiceProxyBase {
  constructor() {
    super();

    this.mockGenerator = FlexiciousMockGenerator.instance();
    this.delay = 2000;
    this.showBusyCursor = true;
  }

  getClassNames() {
    return ["BusinessService", "ServiceProxyBase"];
  }

  static getInstance() {
    if (BusinessService.instance === null) {
      BusinessService.instance = new BusinessService();
    }
    return BusinessService.instance;
  }
  getDeepOrgList(resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;
    this.mockGenerator.getDeepOrgListWithResult(resultHandler);
  }

  getFlatOrgList(resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getFlatOrgList(),
      resultHandler,
      faultHandler
    );
  }

  getDeepOrg(orgId, resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getDeepOrg(orgId),
      resultHandler,
      faultHandler
    );
  }

  getPagedOrganizationList(filter, resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getPagedOrganizationList(filter),
      resultHandler,
      faultHandler
    );
  }

  getDealsForOrganization(orgId, filter, resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getDealsForOrganization(orgId, filter),
      resultHandler,
      faultHandler
    );
  }

  getInvoicesForDeal(dealId, filter, resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getInvoicesForDeal(dealId, filter),
      resultHandler,
      faultHandler
    );
  }

  getLineItemsForInvoice(invoiceId, filter, resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getLineItemsForInvoice(invoiceId, filter),
      resultHandler,
      faultHandler
    );
  }

  getAllLineItems(resultHandler, faultHandler) {
    if (typeof faultHandler === "undefined") faultHandler = null;

    this.callServiceMethod(
      this.mockGenerator.getAllLineItems(),
      resultHandler,
      faultHandler
    );
  }
}
