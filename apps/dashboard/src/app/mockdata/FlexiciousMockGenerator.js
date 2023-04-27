import CustomerOrganization from "./CustomerOrganization";
import Address from "./Address";
import SystemConstants from "./SystemConstants";
import Person from "./Person";
import SystemUser from "./SystemUser";
import Deal from "./Deal";
import Invoice from "./Invoice";
import LineItem from "./LineItem";
import { shortMonthNames } from "@ezgrid/grid-core";

/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
let _pageIndex = 0;
let _pageSize = 30;
let lineItemIndex = 0;

export default class FlexiciousMockGenerator {
  constructor() {
    this.index = 0;
  }

  static getMockNestedData() {
    return [
      {
        employeeName: "Tony Devanthery",
        title: "Architect",
        hireDate: "07/08/2008",
        fileId: "tdony@email.com",
        emailAddress: "tdony@email.com",
        department: "IT",
        employeeId: "EMP_TNY_DVN",
        items: [
          {
            identifier: "versionId",
            comments: "Created By Job",
            project: "Mapping",
            roleOnProject: "Lead Developer",
            createdBy: "6/3/2012",
            initialArchiveFlag: true,
            projectStartDate: "08/08/2008",
            projectEndDate: "08/08/2010",
            projectId: "PRJ_MPING",
            items: [
              {
                hours: 40,
                rate: 100,
                timeSheetTitle: "Time Sheet-1",
                totalExpense: 4000,
                timesheetId: "TD_MP_TS1",
              },
              {
                hours: 42,
                rate: 100,
                timeSheetTitle: "Time Sheet-2",
                totalExpense: 4200,
                timesheetId: "TD_MP_TS2",
              },
            ],
          },
          {
            project: "Network Analysis",
            roleOnProject: "Lead Developer",
            projectStartDate: "08/09/2010",
            projectEndDate: "08/09/2011",
            projectId: "PRJ_NTA",
            items: [
              {
                hours: 46,
                rate: 100,
                timeSheetTitle: "Time Sheet-1",
                totalExpense: 4600,
                timesheetId: "TD_NTA_TS1",
              },
              {
                hours: 48,
                rate: 100,
                timeSheetTitle: "Time Sheet-2",
                totalExpense: 4800,
                timesheetId: "TD_NTA_TS2",
              },
            ],
          },
        ],
      },
      {
        employeeName: "Jason Parker",
        title: "Programmer",
        hireDate: "06/06/2008",
        department: "Support",
        emailAddress: "jpason@email.com",
        employeeId: "EMP_JSN_PRK",
        items: [
          {
            project: "Grid Support",
            roleOnProject: "Developer",
            projectStartDate: "06/07/2008",
            projectEndDate: "06/12/2009",
            projectId: "PRJ_GRD",
            items: [
              {
                hours: 42,
                rate: 100,
                timeSheetTitle: "Time Sheet-1",
                totalExpense: 4200,
                timesheetId: "TD_GRD_TS1",
              },
              {
                hours: 49,
                rate: 100,
                timeSheetTitle: "Time Sheet-2",
                totalExpense: 4900,
                timesheetId: "TD_GRD_TS2",
              },
            ],
          },
          {
            project: "Mapsharp",
            roleOnProject: "Architect",
            projectStartDate: "06/14/2009",
            projectEndDate: "06/12/2011",
            projectId: "PRJ_MPSHRP",
            items: [
              {
                hours: 40,
                rate: 100,
                timeSheetTitle: "Time Sheet-1",
                totalExpense: 4000,
                timesheetId: "TD_MPSH_TS1",
              },
            ],
          },
        ],
      },
    ];
  }

  getClassNames() {
    return "FlexiciousMockGenerator";
  }

  static instance() {
    return _instance;
  }

  getAllLineItems() {
    if (FlexiciousMockGenerator.lineItems.length === 0) {
      this.getDeepOrgList();
    }
    return FlexiciousMockGenerator.lineItems;
  }

  getFlatOrgList() {
    if (!this.simpleList) {
      this.simpleList = this.getOrgList(false);
    }
    return this.simpleList.slice();
  }
  getDeepOrgListSync() {
    if (!this.deepList || this.deepList.length === 0) {
      this.deepList = this.getOrgList(true);
    }
    return this.deepList;
  }
  getDeepOrgList() {
    if (!this.deepList) {
      this.deepList = this.getOrgList(true);
    }
    return this.deepList;
  }
  getDeepOrgListWithResult(result) {
    if (!this.deepList || this.deepList.length === 0) {
      this.deepList = this.getOrgList(true);
    }
    result({ result: this.deepList });
  }
  init() {
    this.deepList = [];
    this.index = 0;
    // const timer = new Timer(100);
    // timer.addEventListener(this, Constants.EVENT_TIMER, this.onTimer);
    // timer.start();
    this.onTimer();
  }

  onTimer(evt) {
    for (
      let i = _pageIndex * _pageSize;
      i <
      Math.min(
        FlexiciousMockGenerator.companyNames.length,
        (_pageIndex + 1) * _pageSize
      );
      i++
    ) {
      const nm = FlexiciousMockGenerator.companyNames[i];
      this.deepList.push(this.createOrganization(nm, true));
    }
    if (_pageIndex * _pageSize >= FlexiciousMockGenerator.companyNames.length) {
      this.progress = 100;
      return;
    } else {
      this.progress =
        (_pageIndex * _pageSize * 100) /
        FlexiciousMockGenerator.companyNames.length;
      _pageIndex++;
      this.onTimer(evt);
    }
  }

  getOrgList(deep) {
    const orgs = [];
    for (const nm of FlexiciousMockGenerator.companyNames) {
      orgs.push(this.createOrganization(nm, deep));
    }

    return orgs;
  }

  getDeepOrg(orgId) {
    for (const org of this.deepList) {
      if (org.id === orgId) {
        return org.clone();
      }
    }

    throw new Error(`Invalid org ID passed in : ${orgId}`);
  }



  //   getPagedOrganizationList(filter) {
  //     if (!this.simpleList) {
  //       this.simpleList = this.getOrgList(false);
  //     }

  //     if (filter.implementsOrExtends('PrintExportFilter')) {
  //       const pef = filter;
  //       if (
  //         pef.printExportOptions.printExportOption ==
  //         PrintExportOptions.PRINT_EXPORT_ALL_PAGES
  //       ) {
  //         filter.setPageIndex(-1); //so we return all records.
  //         return new PagedResult(
  //           UIUtils.filterPageSort(this.deepList, filter),
  //           filter.recordCount
  //         );
  //       } else {
  //         return new PagedResult(
  //           UIUtils.filterPageSort(this.deepList, filter, [
  //             pef.printExportOptions.pageFrom,
  //             pef.printExportOptions.pageTo,
  //           ]),
  //           filter.recordCount
  //         );
  //       }
  //     } else
  //       return new PagedResult(
  //         UIUtils.filterPageSort(this.simpleList, filter),
  //         filter.recordCount,
  //         {},
  //         true
  //       );
  //   }

  //   getDealsForOrganization(orgId, filter) {
  //     for (const org of this.getDeepOrgList()) {
  //       if (org.id===orgId) {
  //         const arr = org.deals;
  //         return new PagedResult(
  //           filter.pageIndex >= 0 ? UIUtils.filterPageSort(arr, filter) : arr,
  //           arr.length,
  //           { total: UIUtils.sum(org.deals, 'dealAmount'), count: arr.length },
  //           false
  //         );
  //       }
  //     }

  //     return new PagedResult([], 0);
  //   }

  //   getInvoicesForDeal(dealId, filter) {
  //     for (const org of this.getDeepOrgList()) {
  //       for (const deal of org.deals) {
  //         if (deal.id===dealId) {
  //           const arr = deal.invoices;
  //           return new PagedResult(
  //             filter.pageIndex >= 0 ? UIUtils.filterPageSort(arr, filter) : arr,
  //             arr.length,
  //             { total: UIUtils.sum(arr, 'invoiceAmount'), count: arr.length },
  //             false
  //           );
  //         }
  //       }
  //     }

  //     return new PagedResult([], 0);
  //   }

  //   getLineItemsForInvoice(invoiceId, filter) {
  //     for (const org of this.getDeepOrgList()) {
  //       for (const deal of org.deals) {
  //         for (const invoice of deal.invoices) {
  //           if (invoice.id===invoiceId) {
  //             const arr = invoice.lineItems;
  //             return new PagedResult(
  //               filter.pageIndex >= 0 ? UIUtils.filterPageSort(arr, filter) : arr,
  //               arr.length,
  //               {
  //                 total: UIUtils.sum(arr, 'lineItemAmount'),
  //                 count: org.deals.length,
  //               },
  //               false
  //             );
  //           }
  //         }
  //       }
  //     }

  //     return new PagedResult([], 0);
  //   }

  createOrganization(legalName, deep) {
    if (deep) this.index++;
    const org = new CustomerOrganization();
    org.id = 20800 + FlexiciousMockGenerator.companyNames.indexOf(legalName);
    org.legalName = legalName;
    org.headquarterAddress = FlexiciousMockGenerator.createAddress();
    org.mailingAddress = FlexiciousMockGenerator.createAddress();
    org.billingContact = FlexiciousMockGenerator.createContact();
    org.salesContact = FlexiciousMockGenerator.createContact();
    org.annualRevenue = FlexiciousMockGenerator.getRandom(1000, 60000);
    org.numEmployees = FlexiciousMockGenerator.getRandom(1000, 60000);
    org.earningsPerShare =
      FlexiciousMockGenerator.getRandom(1, 6) +
      FlexiciousMockGenerator.getRandom(1, 99) / 100;
    org.lastStockPrice =
      FlexiciousMockGenerator.getRandom(10, 30) +
      FlexiciousMockGenerator.getRandom(1, 99) / 100;
    org.url = `http://www.google.com/search?q=${legalName}`;
    org.chartUrl = `http://www.flexicious.com/resources/images/chart${FlexiciousMockGenerator.getRandom(
      1,
      7
    )}.png`;
    const year = new Date().getFullYear();
    for (var i = 1; i <= 12; i++) {
      const month = shortMonthNames[i - 1];
      org[`${year}_${month}`] = FlexiciousMockGenerator.getRandom(1000, 60000);
    }
    for (i = 1; i <= 4; i++) {
      //sum of the months of the quarter
      const quarter = `${year}_Q${i}`;
      org[quarter] = org[`${year}_${shortMonthNames[i * 3 - 3]}`] + org[`${year}_${shortMonthNames[i * 3 - 2]}`] + org[`${year}_${shortMonthNames[i * 3 - 1]}`];
    }
    org[`${year}`] = org[`${year}_Q1`] + org[`${year}_Q2`] + org[`${year}_Q3`] + org[`${year}_Q4`];

    org.addedDate = FlexiciousMockGenerator.getRandomDate();
    if (deep) {
      for (
        let dealIdx = 0;
        dealIdx < FlexiciousMockGenerator.DEALS_PER_ORG;
        dealIdx++
      ) {
        org.deals.push(this.createDeal(dealIdx, org, deep));
      }
    }
    return org;
  }

  createDeal(idx, org, deep) {
    const deal = new Deal();
    deal.customer = org;
    deal.dealDate = FlexiciousMockGenerator.getRandomDate();
    deal.dealDescription = `Project # ${org.deals.length + 1} - ${org.legalName
      } - ${deal.dealDate.getMonth() + 1}/${deal.dealDate.getFullYear()}`;
    deal.dealStatus = FlexiciousMockGenerator.getRandomReferenceData(
      SystemConstants.dealStatuses
    ).cloneSpecial();
    deal.id = org.id * 10 + idx;
    if (deep) {
      for (
        let invoiceIDx = 0;
        invoiceIDx < FlexiciousMockGenerator.INVOICES_PER_DEAL;
        invoiceIDx++
      ) {
        deal.invoices.push(this.createInvoice(invoiceIDx, deal, deep));
      }
    }
    FlexiciousMockGenerator.setGlobals(deal);
    return deal;
  }

  createInvoice(idx, deal, deep) {
    const invoice = new Invoice();
    invoice.deal = deal;
    invoice.invoiceDate = FlexiciousMockGenerator.getRandomDate();
    invoice.id = deal.id * 10 + idx;
    invoice.invoiceStatus = FlexiciousMockGenerator.getRandomReferenceData(
      SystemConstants.invoiceStatuses
    ).cloneSpecial();
    invoice.dueDate = new Date(
      invoice.invoiceDate.getTime() + 1000 * 60 * 60 * 24 * 30
    );
    invoice.hasPdf = FlexiciousMockGenerator.getRandom(1, 2) === 1;
    if (deep) {
      for (
        let lineItemIDx = 0;
        lineItemIDx < FlexiciousMockGenerator.LINEITEMS_PER_INVOICE;
        lineItemIDx++
      ) {
        const lineItem = this.createInvoiceLineItem(lineItemIDx, invoice, deep);
        invoice.lineItems.push(lineItem);
      }
    }
    FlexiciousMockGenerator.setGlobals(invoice);
    return invoice;
  }
  createInvoiceLineItem(lineItemIdx, invoice, deep) {
    const lineItem = new LineItem();
    lineItem.index = lineItemIndex++;
    lineItem.id = invoice.id * 10 + lineItemIdx;
    lineItem.invoice = invoice;
    lineItem.lineItemAmount = FlexiciousMockGenerator.getRandom(10000, 50000);
    lineItem.lineItemDescription = `Professional Services - ${FlexiciousMockGenerator.getRandomReferenceData(
      SystemConstants.billableConsultants
    ).cloneSpecial().name
      }`;
    lineItem.units = lineItem.lineItemAmount / 100;
    FlexiciousMockGenerator.setGlobals(lineItem);
    FlexiciousMockGenerator.lineItems.push(lineItem);
    return lineItem;
  }

  static getRandomReferenceData(arr) {
    return arr[FlexiciousMockGenerator.getRandom(0, arr.length - 1)];
  }

  static createContact() {
    const commercialContact = new Person();
    commercialContact.firstName =
      this.firstNames[
      FlexiciousMockGenerator.getRandom(0, this.firstNames.length - 1)
      ];
    commercialContact.lastName =
      this.lastNames[
      FlexiciousMockGenerator.getRandom(0, this.lastNames.length - 1)
      ];
    commercialContact.homeAddress = FlexiciousMockGenerator.createAddress();
    commercialContact.telephone = FlexiciousMockGenerator.generatePhone();
    FlexiciousMockGenerator.setGlobals(commercialContact);
    return commercialContact;
  }

  static setGlobals(entity) {
    entity.addedBy = FlexiciousMockGenerator.getSystemUser();
    entity.addedDate = FlexiciousMockGenerator.getRandomDate();
    entity.updatedDate = entity.addedDate;
    entity.updatedBy = FlexiciousMockGenerator.getSystemUser();
  }

  static getRandomDate() {
    return new Date(
      FlexiciousMockGenerator.getRandom(new Date().getFullYear() - 1, new Date().getFullYear() + 1),
      FlexiciousMockGenerator.getRandom(0, 11),
      FlexiciousMockGenerator.getRandom(1, 28)
    );
  }

  static generatePhone() {
    return `${FlexiciousMockGenerator.areaCodes[FlexiciousMockGenerator.getRandom(0, 3)]
      }-${FlexiciousMockGenerator.getRandom(
        100,
        999
      ).toString()}-${FlexiciousMockGenerator.getRandom(1000, 9999).toString()}`;
  }

  static getSystemUser() {
    if (this.sysAdmin) return this.sysAdmin;

    const user = new SystemUser();
    user.addedBy = user;
    user.addedDate = new Date(2017, 1, 1);
    user.updatedBy = user;
    user.updatedDate = new Date(2017, 1, 1);
    user.id = 1;
    user.firstName =
      this.firstNames[
      FlexiciousMockGenerator.getRandom(0, this.firstNames.length - 1)
      ];
    user.lastName =
      this.lastNames[
      FlexiciousMockGenerator.getRandom(0, this.lastNames.length - 1)
      ];
    user.loginNm = "system_admin";
    this.sysAdmin = user;
    return user;
  }

  static createAddress() {
    const address = new Address();
    address.line1 = `${FlexiciousMockGenerator.getRandom(
      100,
      999
    ).toString()} ${FlexiciousMockGenerator.streetNames[
    FlexiciousMockGenerator.getRandom(
      0,
      FlexiciousMockGenerator.streetNames.length - 1
    )
    ]
      } ${FlexiciousMockGenerator.streetTypes[
      FlexiciousMockGenerator.getRandom(
        0,
        FlexiciousMockGenerator.streetTypes.length - 1
      )
      ]
      }`;
    address.line2 = `Suite #${FlexiciousMockGenerator.getRandom(1, 1000)}`;
 
    address.state =
      SystemConstants.states[
      FlexiciousMockGenerator.getRandom(0, SystemConstants.states.length - 1)
      ];
    address.city = address.state.children[ FlexiciousMockGenerator.getRandom(0, address.state.children.length - 1)];
      
    address.country = SystemConstants.usCountry;
    return address;
  }

  static getRandom(minNum, maxNum) {
    return Math.ceil(Math.random() * (maxNum - minNum + 1)) + (minNum - 1);
  }
}

FlexiciousMockGenerator.areaCodes = ["201", "732", "212", "646", "800", "866"];
FlexiciousMockGenerator.streetTypes = ["Ave", "Blvd", "Rd", "St", "Lane"];
FlexiciousMockGenerator.streetNames = [
  "Park",
  "West",
  "Newark",
  "King",
  "Gardner",
];

FlexiciousMockGenerator.companyNames = [
  "3M Co",
  "Abbott Laboratories",
  "Adobe Systems",
  "Advanced Micro Dev",
  "Aetna Inc",
  "Affiliated Computer Svcs",
  "AFLAC Inc",
  "Air Products & Chem",
  "Airgas Inc",
  "AK Steel Holding",
  "Akamai Technologies",
  "Alcoa Inc",
  "Allegheny Energy",
  "Allegheny Technologies",
  "Allergan, Inc",
  "Allstate Corp",
  "Altera Corp",
  "Altria Group",
  "Amazon.com Inc",
  "Amer Electric Pwr",
  "Amer Express",
  "Amer Tower",
  "Ameren Corp",
  "Ameriprise Financial",
  "AmerisourceBergen Corp",
  "Amgen Inc",
  "Amphenol Corp",
  "Anadarko Petroleum",
  "Aon Corp",
  "Apache Corp",
  "Apartment Investment & Mgmt",
  "Apollo Group",
  "Apple Inc",
  "Archer-Daniels-Midland",
  "Assurant Inc",
  "AT&T Inc",
  "Automatic Data Proc",
  "AutoNation Inc",
  "AutoZone Inc",
  "AvalonBay Communities",
  "Avery Dennison Corp",
  "Avon Products",
  "Baker Hughes Inc",
  "Ball Corp",
  "Bank of America",
  "Bank of New York Mellon",
  "Bard (C.R.)",
  "Baxter Intl",
  "BB&T Corp",
  "Becton, Dickinson",
  "Bed Bath & Beyond",
  "Bemis Co",
  "Best Buy",
  "Biogen Idec",
  "Black & Decker Corp",
  "BMC Software",
  "Boeing Co",
  "Boston Properties",
  "Boston Scientific",
  "Bristol-Myers Squibb",
  "Broadcom Corp",
  "Burlington Northn Santa Fe",
  "C.H. Robinson Worldwide",
  "CA Inc",
  "Cabot Oil & Gas",
  "Cameron Intl",
  "Capital One Financial",
  "Carnival Corp",
  "Caterpillar Inc",
  "CB Richard Ellis Grp",
  "Celgene Corp",
  "CenterPoint Energy",
  "Cephalon Inc",
  "CF Industries Hldgs",
  "Chesapeake Energy",
  "Chevron Corp",
  "Chubb Corp",
  "Cincinnati Financial",
  "Cintas Corp",
  "Cisco Systems",
  "Citigroup Inc",
  "Citrix Systems",
  "Clorox Co",
  "CME Group Inc",
  "CMS Energy",
  "Coach Inc",
  "Coca-Cola Co",
  "Coca-Cola Enterprises",
  "Cognizant Tech Solutions",
  "Colgate-Palmolive",
  "Comcast Cl",
  "Comerica Inc",
  "Compuware Corp",
  "ConAgra Foods",
  "ConocoPhillips",
  "CONSOL Energy",
  "Consolidated Edison",
  "Constellation Brands",
  "Constellation Energy Group",
  "Convergys Corp",
  "Corning Inc",
  "Costco Wholesale",
  "Coventry Health Care",
  "CSX Corp",
  "Cummins Inc",
  "Danaher Corp",
  "Darden Restaurants",
  "DaVita Inc",
  "Dean Foods",
  "DENTSPLY Intl",
  "Devon Energy",
  "DeVry Inc",
  "Diamond Offshore Drilling",
  "Discover Financial Svcs",
  "Dominion Resources",
  "Donnelley(R.R.)& Sons",
  "Dover Corp",
  "Dow Chemical",
  "DTE Energy",
  "Duke Energy",
  "Dun & Bradstreet",
  "duPont(E.I.)deNemours",
  "E Trade Financial",
  "Eastman Chemical",
  "Eastman Kodak",
  "Eaton Corp",
  "eBay Inc",
  "Ecolab Inc",
  "El Paso Corp",
  "EMC Corp",
  "Emerson Electric",
  "ENSCO Intl",
  "Entergy Corp",
  "EQT Corp",
  "Equifax Inc",
  "Equity Residential",
  "Exelon Corp",
  "Expedia Inc",
  "Expeditors Intl,Wash",
  "Express Scripts",
  "Exxon Mobil",
  "Family Dollar Stores",
  "Fastenal Co",
  "Federated Investors ",
  "FedEx Corp",
  "Fidelity Natl Info Svcs",
  "Fifth Third Bancorp",
  "First Horizon Natl",
  "FirstEnergy Corp",
  "Fiserv Inc",
  "FLIR Systems",
  "Flowserve Corp",
  "FMC Corp",
  "FMC Technologies",
  "Ford Motor",
  "Forest Labs",
  "Fortune Brands",
  "FPL Group",
  "Franklin Resources",
  "Freept McMoRan Copper&Gold",
  "Frontier Communications",
  "Gannett Co",
  "Genl Dynamics",
  "Genl Electric",
  "Genl Mills",
  "Genuine Parts",
  "Genworth Financial",
  "Genzyme Corp",
  "Gilead Sciences",
  "Goldman Sachs Group",
  "Goodrich Corp",
  "Goodyear Tire & Rub",
  "Google Inc",
  "Grainger (W.W.)",
  "Halliburton Co",
  "Harley-Davidson",
  "Harman Intl",
  "Harris Corp",
  "Hartford Finl Svcs Gp",
  "Hasbro Inc",
  "HCP Inc",
  "Health Care REIT",
  "Hershey Co",
  "Hess Corp",
  "Honeywell Intl",
  "Hospira Inc",
  "Host Hotels & Resorts",
  "Hudson City Bancorp",
  "Humana Inc",
  "Huntington Bancshares",
  "Illinois Tool Works",
  "IMS Health",
  "Intel Corp",
  "IntercontinentalExchange Inc",
  "Interpublic Grp Cos",
  "Intl Bus. Machines",
  "Intl Flavors/Fragr",
  "Intl Paper",
  "Intuitive Surgical",
  "INVESCO Ltd",
  "Iron Mountain",
  "ITT Corp",
  "Jabil Circuit",
  "Janus Capital Group",
  "Johnson & Johnson",
  "Johnson Controls",
  "JPMorgan Chase & Co",
  "Juniper Networks",
  "KB HOME",
  "Kellogg Co",
  "KeyCorp",
  "Kimberly-Clark",
  "Kimco Realty",
  "KLA-Tencor Corp",
  "Kraft Foods",
  "L-3 Communications Hldgs",
  "Laboratory Corp Amer Hldgs",
  "Lauder (Estee) Co",
  "Legg Mason Inc",
  "Leggett & Platt",
  "Lennar Corp",
  "Lexmark Intl",
  "Life Technologies",
  "Lilly (Eli)",
  "Lincoln Natl Corp",
  "Linear Technology Corp",
  "Lockheed Martin",
  "Loews Corp",
  "Lorillard Inc",
  "LSI Corp",
  "M&T Bank",
  "Marathon Oil",
  "Marriott Intl",
  "Marsh & McLennan",
  "Marshall & Ilsley",
  "Masco Corp",
  "Massey Energy",
  "MasterCard Inc",
  "Mattel, Inc",
  "McAfee Inc",
  "McCormick & Co",
  "McDonalds Corp",
  "McGraw-Hill Companies",
  "McKesson Corp",
  "MeadWestvaco Corp",
  "Medco Health Solutions",
  "MEMC Electronic Materials",
  "Merck & Co",
  "Meredith Corp",
  "MetLife Inc",
  "Microchip Technology",
  "Micron Technology",
  "Microsoft Corp",
  "Molex Inc",
  "Molson Coors Brewing",
  "Monsanto Co",
  "Monster Worldwide",
  "Moodys Corp",
  "Morgan Stanley",
  "Motorola, Inc",
  "Murphy Oil",
  "Mylan Inc",
  "Nabors Indus",
  "Natl Oilwell Varco",
  "Natl Semiconductor",
  "New York Times",
  "Newell Rubbermaid",
  "Newmont Mining",
  "News Corp ",
  "NICOR Inc",
  "NIKE, Inc",
  "NiSource Inc",
  "Noble Energy",
  "Norfolk Southern",
  "Northeast Utilities",
  "Northern Trust",
  "Northrop Grumman",
  "Novellus Systems",
  "Nucor Corp",
  "NYSE Euronext",
  "OReilly Automotive",
  "Occidental Petroleum",
  "Office Depot",
  "Omnicom Group",
  "Oracle Corp",
  "Owens-Illinois",
  "PACCAR Inc",
  "Pactiv Corp",
  "Parker-Hannifin",
  "Paychex Inc",
  "Peabody Energy",
  "Peoples United Financial",
  "Pepco Holdings",
  "Pepsi Bottling Group",
  "PepsiCo Inc",
  "PerkinElmer Inc",
  "Pfizer, Inc",
  "PG&E Corp",
  "Philip Morris Intl",
  "Pinnacle West Capital",
  "Pioneer Natural Resources",
  "Pitney Bowes",
  "Plum Creek Timber",
  "PNC Financial Services Group",
  "Polo Ralph Lauren",
  "PPG Indus",
  "PPL Corp",
  "Praxair Inc",
  "Precision Castparts",
  "Principal Financial Grp",
  "Procter & Gamble",
  "Progress Energy",
  "Progressive Corp,Ohio",
  "ProLogis",
  "Prudential Financial",
  "Public Svc Enterprises",
  "Pulte Homes",
  "QLogic Corp",
  "QUALCOMM Inc",
  "Quanta Services",
  "Quest Diagnostics",
  "Questar Corp",
  "Qwest Communications Intl",
  "RadioShack Corp",
  "Range Resources",
  "Raytheon Co",
  "Red Hat Inc",
  "Regions Financial",
  "Republic Services",
  "Reynolds American",
  "Robert Half Intl",
  "Rockwell Collins",
  "Rowan Cos",
  "Ryder System",
  "Safeway Inc",
  "SanDisk Corp",
  "SCANA Corp",
  "Schering-Plough",
  "Schlumberger Ltd",
  "Schwab(Charles)Corp",
  "Sealed Air",
  "Sherwin-Williams",
  "Sigma-Aldrich",
  "Simon Property Group",
  "SLM Corp",
  "Smith Intl",
  "Snap-On Inc",
  "Southern Co",
  "Southwest Airlines",
  "Southwestern Energy",
  "Sprint Nextel Corp",
  "St. Jude Medical",
  "Stanley Works",
  "Starwood Hotels&Res Worldwide",
  "State Street Corp",
  "Stericycle Inc",
  "Stryker Corp",
  "SunTrust Banks",
  "Supervalu Inc",
  "Symantec Corp",
  "Sysco Corp",
  "T.Rowe Price Group",
  "TECO Energy",
  "Tellabs, Inc",
  "Tenet Healthcare",
  "Teradyne Inc",
  "Texas Instruments",
  "Textron, Inc",
  "Thermo Fisher Scientific",
  "Time Warner",
  "Torchmark Corp",
  "Total System Svcs",
  "Travelers Cos",
  "U.S. Bancorp",
  "U.S. Steel",
  "Union Pacific",
  "United Parcel",
  "United Technologies",
  "UnitedHealth Group",
  "Unum Group",
  "Valero Energy",
  "Varian Medical Systems",
  "Ventas Inc",
  "Verizon Communications",
  "VF Corp",
  "Viacom Inc",
  "Vornado Realty Trust",
  "Vulcan Materials",
  "Walgreen Co",
  "Washington Post",
  "Waste Management",
  "Waters Corp",
  "Watson Pharmaceuticals",
  "WellPoint Inc",
  "Wells Fargo",
  "Western Digital",
  "Western Union",
  "Whirlpool Corp",
  "Whole Foods Market",
  "Williams Cos",
  "Wisconsin Energy Corp",
  "Wyndham Worldwide",
  "Wynn Resorts",
  "Xcel Energy",
  "Xerox Corp",
  "Xilinx Inc",
  "XL Capital Ltd",
  "XTO Energy",
  "Yahoo Inc",
  "Yum Brands",
  "Zimmer Holdings",
];

FlexiciousMockGenerator.lastNames = [
  "SMITH",
  "JOHNSON",
  "WILLIAMS",
  "BROWN",
  "JONES",
  "MILLER",
  "DAVIS",
  "GARCIA",
  "RODRIGUEZ",
  "WILSON",
  "MARTINEZ",
  "ANDERSON",
  "TAYLOR",
  "THOMAS",
  "HERNANDEZ",
  "MOORE",
  "MARTIN",
  "JACKSON",
  "THOMPSON",
  "WHITE",
  "LOPEZ",
  "LEE",
  "GONZALEZ",
  "HARRIS",
  "CLARK",
  "LEWIS",
  "ROBINSON",
  "WALKER",
  "PEREZ",
  "HALL",
  "YOUNG",
  "ALLEN",
  "SANCHEZ",
  "WRIGHT",
  "KING",
  "SCOTT",
];

FlexiciousMockGenerator.firstNames = [
  "LATONYA",
  "CANDY",
  "MORGAN",
  "CONSUELO",
  "TAMIKA",
  "ROSETTA",
  "DEBORA",
  "CHERIE",
  "POLLY",
  "DINA",
  "JEWELL",
  "FAY",
  "JILLIAN",
  "DOROTHEA",
  "NELL",
  "TRUDY",
  "ESPERANZA",
  "PATRICA",
  "KIMBERLEY",
  "FRANK",
  "SCOTT",
  "ERIC",
  "STEPHEN",
  "ANDREW",
  "RAYMOND",
  "GREGORY",
  "JOSHUA",
  "JERRY",
  "DENNIS",
  "WALTER",
  "PATRICK",
  "PETER",
  "HAROLD",
  "DOUGLAS",
  "HENRY",
  "CARL",
  "ARTHUR",
  "RYAN",
];

FlexiciousMockGenerator.mockNestedXml =
  "<ReactDataGrid x='0' y='0' forcePagerRow='true' enableFilters='true' enableMultiColumnSort='true' builtInActions='sort,separator'  width='100%' height='100%' id='dgMain' styleName='FlexiciousGridStyle' enableSelectionCascade='true' enableSelectionBubble='true' enableTriStateCheckbox='true' showSpinnerOnFilterPageSort='true' enableDefaultDisclosureIcon='false'>" +
  "  <ReactDataGridColumnLevel childrenField='items'  enableFilters='false' nestIndent='20' selectedKeyField='employeeId'>" +
  "    " +
  "      <ReactDataGridColumn sortable='false' headerText='' excludeFromSettings='true' enableExpandCollapseIcon='true' width='25' columnWidthMode='fixed'/>" +
  "      <ReactDataGridColumn type='checkbox'/>" +
  "      <ReactDataGridColumn headerText='Employee Name' dataField='employeeName' filterControl='TextInput' filterOperation='BeginsWith'  />" +
  "      <ReactDataGridColumn headerText='Title' dataField='title' filterControl='TextInput' filterOperation='BeginsWith'/>" +
  "      <ReactDataGridColumn headerText='Email Address' dataField='emailAddress' filterControl='TextInput' filterOperation='BeginsWith'/>" +
  "      <ReactDataGridColumn headerText='Department' dataField='department' filterControl='TextInput' filterOperation='BeginsWith'/>" +
  "      <ReactDataGridColumn headerText='Hire Date' dataField='hireDate' filterControl='TextInput' filterOperation='BeginsWith' />" +
  "      " +
  "      " +
  "      <ReactDataGridColumnLevel reusePreviousLevelColumns='false' childrenField='items'   headerVerticalGridLineThickness='1' selectedKeyField='projectId'>" +
  "        " +
  "	       <ReactDataGridColumn sortable='false' headerText='' excludeFromSettings='true' enableExpandCollapseIcon='true' width='50' columnWidthMode='fixed' expandCollapseIconLeft='25'/>" +
  "   	   <ReactDataGridColumn type='checkbox'/>" +
  "          <ReactDataGridColumn  dataField='project' headerText='Project' />" +
  "          <ReactDataGridColumn dataField='roleOnProject' headerText='Role On Project'  />" +
  "          <ReactDataGridColumn dataField='projectStartDate' headerText='Project Start'  />" +
  "          <ReactDataGridColumn dataField='projectEndDate' headerText='Project End'  />" +
  "        " +
  "        " +
  "          <ReactDataGridColumnLevel reusePreviousLevelColumns='false' childrenField='items' headerVerticalGridLineThickness='1'  selectedKeyField='timesheetId'>" +
  "            " +
  "	       	   <ReactDataGridColumn sortable='false' headerText='' excludeFromSettings='true' width='75' columnWidthMode='fixed'/>" +
  "   	   	   <ReactDataGridColumn type='checkbox'/>" +
  "              <ReactDataGridColumn dataField='timeSheetTitle' headerText='TimeSheet Title' />" +
  "              <ReactDataGridColumn dataField='hours' headerText='Hours'  />" +
  "              <ReactDataGridColumn dataField='rate' headerText='Rate'  />" +
  "              <ReactDataGridColumn dataField='totalExpense' headerText='Total Expense'  />" +
  "            " +
  "          </ReactDataGridColumnLevel>" +
  "        " +
  "      </ReactDataGridColumnLevel>" +
  "    " +
  "  </ReactDataGridColumnLevel>" +
  "</ReactDataGrid>";

FlexiciousMockGenerator.dpHierarchyXML =
  "<root><Region Region=\"Southwest\">" +
  "   <Region Region=\"Arizona\">" +
  "       <Territory_Rep Territory_Rep=\"Barbara Jennings\" Actual=\"38865\" Estimate=\"40000\"/>" +
  "       <Territory_Rep Territory_Rep=\"Dana Binn\" Actual=\"29885\" Estimate=\"30000\"/>" +
  "   </Region>" +
  "   <Region Region=\"Central California\">" +
  "       <Territory_Rep Territory_Rep=\"Joe Smith\" Actual=\"29134\" Estimate=\"30000\"/>" +
  "   </Region>" +
  "   <Region Region=\"Nevada\">" +
  "       <Territory_Rep Territory_Rep=\"Bethany Pittman\" Actual=\"52888\" Estimate=\"45000\"/>" +
  "   </Region>" +
  "   <Region Region=\"Northern California\">" +
  "       <Territory_Rep Territory_Rep=\"Lauren Ipsum\" Actual=\"38805\" Estimate=\"40000\"/>" +
  "       <Territory_Rep Territory_Rep=\"T.R. Smith\" Actual=\"55498\" Estimate=\"40000\"/>" +
  "   </Region>" +
  "   <Region Region=\"Southern California\">" +
  "       <Territory_Rep Territory_Rep=\"Alice Treu\" Actual=\"44985\" Estimate=\"45000\"/>" +
  "       <Territory_Rep Territory_Rep=\"Jane Grove\" Actual=\"44913\" Estimate=\"45000\"/>" +
  "   </Region>" +
  "   </Region>" +
  "   <Region Region=\"Northeast\">" +
  "   <Region Region=\"New York\">" +
  "       <Territory_Rep Territory_Rep=\"Alex Smith\" Actual=\"49229\" Estimate=\"50000\"/>" +
  "       <Territory_Rep Territory_Rep=\"Joe Pittman\" Actual=\"35555\" Estimate=\"40000\"/>" +
  "   </Region>" +
  "   <Region Region=\"New Jersey\">" +
  "       <Territory_Rep Territory_Rep=\"Joe Smith\" Actual=\"28394\" Estimate=\"30000\"/>" +
  "   </Region>" +
  "   <Region Region=\"Connecticut\">" +
  "       <Territory_Rep Territory_Rep=\"Amanda Peters\" Actual=\"44331\" Estimate=\"55000\"/>" +
  "       <Territory_Rep Territory_Rep=\"Jake Fremmer\" Actual=\"55434\" Estimate=\"65000\"/>" +
  "   </Region>" +
  " </Region></root>";
FlexiciousMockGenerator.DEALS_PER_ORG = 2;
FlexiciousMockGenerator.INVOICES_PER_DEAL = 2;
FlexiciousMockGenerator.LINEITEMS_PER_INVOICE = 5;

FlexiciousMockGenerator.lineItems = [];
FlexiciousMockGenerator.simpleList = null;
FlexiciousMockGenerator.deepList = null;
var _instance = new FlexiciousMockGenerator();
