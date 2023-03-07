import { TypedObject } from "./TypedObject";
import { formatDate, formatCurrency } from "@euxdt/grid-core";
/**
 * Typical model class, Employee with typical properties
 * @constructor
 * @namespace
 *
 */
export default class Employee extends TypedObject {
  constructor() {
    super();
    this.firstName = null;
    this.lastName = null;
    this.employeeId = null;
    this.hireDate = null;
    this.stateCode = null;
    this.address = null;
    this.phoneNumber = null;
    this.annualSalary = null;
    this.isActive = null;
    this.department = null;
    this.departmentId = null;
    this.addresses = [];
  }

  getClassNames() {
    return ["Employee", "TypedObject"];
  }

  static createNullEmployee() {
    const employee = new Employee();
    employee.firstName = null;
    employee.lastName = null;
    employee.hireDate = null;
    employee.employeeId = Employee.index++;
    employee.phoneNumber = null;
    employee.isActive = Employee.getRandom(1, 2) === 1;
    employee.department = null;
    employee.stateCode = null;
    return employee;
  }

  static createEmployee(fName, hDate, lName) {
    const employee = new Employee();
    employee.firstName = fName;
    employee.lastName = lName;
    employee.hireDate = hDate;
    //random date this year
    // const dt = new Date();
    // dt.setMonth(Employee.getRandom(0, 11))
    // dt.setDate(Employee.getRandom(1, 28))
    // employee.hireDate = dt;

    employee.employeeId = Employee.index++;
    employee.employeeIdString = employee.employeeId.toString();
    employee.employeeIdNoSortString = employee.employeeId.toString();

    employee.phoneNumber = `${Employee.areaCodes[Employee.getRandom(0, 3)]
      }-${Employee.getRandom(100, 999).toString()}-${Employee.getRandom(
        1000,
        9999
      ).toString()}`;
    employee.workPhone = `212-${Employee.getRandom(100, 999).toString()}-1234 x ${Employee.getRandom(100, 999).toString()}`;
    employee.isActive = Employee.getRandom(1, 2) === 1;
    employee.annualSalary = Employee.getRandom(50000, 100000);
    employee.department =
      Employee.allDepartments[Employee.getRandom(0, 3)].data;
    const state = Employee.allStates[Employee.getRandom(0, 3)];
    employee.stateCode = state.data;
    employee.address = Employee.createAddress(state.data);

    // const max = Employee.getRandom(0, 4);
    // for (let i = 0; i < max; i++)
    //   employee.addresses.push(
    //     Employee.createAddress(
    //       Employee.allStates[Employee.getRandom(0, 3)].data
    //     )
    //   );

    return employee;
  }

  static createAddress(stateCode) {
    const address = {};
    address.street1 = `${Employee.getRandom(100, 999).toString()} ${Employee.streetNames[
      Employee.getRandom(0, Employee.streetNames.length - 1)
    ]
      } ${Employee.streetTypes[
      Employee.getRandom(0, Employee.streetTypes.length - 1)
      ]
      }`;
    address.city =
      Employee.cities[Employee.getRandom(0, Employee.cities.length - 1)];
    address.state = stateCode;
    address.country = "USA";

    address.apartmentNumber = Employee.getRandom(1, 15);
    address.street2 = `Apt ${address.apartmentNumber}`;
    address.validFrom = new Date(
      Employee.getRandom(2007, 2012),
      Employee.getRandom(0, 11),
      Employee.getRandom(1, 28)
    );
    address.validTo = new Date(
      Employee.getRandom(2012, 2017),
      Employee.getRandom(0, 11),
      Employee.getRandom(1, 28)
    );
    return address;
  }

  static getRandom(minNum, maxNum) {
    return Math.ceil(Math.random() * (maxNum - minNum + 1)) + (minNum - 1);
  }

  static getAllEmployees() {
    if (!Employee.allEmployees) {
      Employee.createEmployees();
    }
    return Employee.allEmployees.slice();
  }

  static exludeNumber13(item) {
    return item && item.employeeId !== 13;
  }

  static createCollection(num) {
    const emp = [];
    while (emp.length < num) {
      emp.push(
        Employee.createEmployee(
          `FirstName${emp.length}`,
          new Date("06/03/1996"),
          `LastName${emp.length}`
        )
      );
    }
    return emp;
  }

  /**
   * Initialize our dummy database here.
   */
  static createEmployees() {
    Employee.allEmployees = [
      Employee.createEmployee("Brice", new Date("06/03/1996"), "Rittwage"),
      Employee.createEmployee("CHUN-FEN", null, "Hukill"),

      Employee.createEmployee("Takahiro", new Date("06/22/2008"), "Aksu"),
      Employee.createEmployee("Corinthians", new Date("02/19/2005"), "Orchard"),
      Employee.createEmployee("Karna", new Date("09/27/2003"), "Arledge"),
      Employee.createEmployee("Takehisa", new Date("07/29/2022"), "Akmanligil"),
      Employee.createEmployee("Ranjana", new Date("10/09/2022"), "Anupoju"),
      Employee.createEmployee("Erico", new Date("10/10/2022"), "Riddell"),
      Employee.createEmployee("Llora", new Date("07/14/1999"), "Lovig"),
      Employee.createEmployee("TIBBY", new Date("07/28/2021"), "Iburg"),
      Employee.createEmployee("Masanori", new Date("02/18/2009"), "ASENCIO"),
      Employee.createEmployee("Jeevan", new Date("01/10/2022"), "EEddddy@"),
      Employee.createEmployee("FAYIZ", new Date("06/04/2022"), "Ayman"),
      Employee.createEmployee("Rassoul", new Date("07/06/2022"), "Asaba"),
      Employee.createEmployee("Emerito", new Date("09/06/2023"), "Meussner"),
      Employee.createEmployee(
        "Luigia",
        new Date("02/23/2004"),
        "Uisprapassorn"
      ),

      Employee.createEmployee("Gwenda", new Date("05/14/2023"), "Weilert"),
      Employee.createEmployee("datatel2", new Date("08/22/2023"), "Atmaja"),
      Employee.createEmployee("Silvana", new Date("12/21/1998"), "Illiano"),
      Employee.createEmployee("Beaul", new Date("10/23/2000"), "Eagle"),
      Employee.createEmployee("Pamala", new Date("10/29/2023"), "Amott"),
      Employee.createEmployee("Roberta", new Date("02/11/2023"), "Obohoski"),
      Employee.createEmployee("Khiem", new Date("07/14/2001"), "Hirji"),
      Employee.createEmployee("Corbin", new Date("04/23/2022"), "Orlandella"),
      Employee.createEmployee("Peg", new Date("06/10/2024"), "Egelston"),
      Employee.createEmployee("GURAVA", new Date("09/07/2022"), "Urban"),
      Employee.createEmployee("Gregory", new Date("09/14/2021"), "Renca"),
      Employee.createEmployee(
        "YVELINE",
        new Date("09/13/2001"),
        "Vellos Coker"
      ),
      Employee.createEmployee("Ginina", new Date("09/12/2009"), "Inyang"),
      Employee.createEmployee("YUN", new Date("03/07/2007"), "UNGCO"),
      Employee.createEmployee("Berdine", new Date("10/02/2002"), "Ericksen"),
      Employee.createEmployee("Surendra", new Date("08/10/2009"), "URISH"),
      Employee.createEmployee(
        "Wei-Cheng",
        new Date("05/07/2002"),
        "EIGER FACP"
      ),
      Employee.createEmployee("Lie-Jun", new Date("05/09/2023"), "Iek"),
      Employee.createEmployee("Bajaji", new Date("01/08/2023"), "Ajmani"),
      Employee.createEmployee("Dariush", new Date("10/17/2006"), "ARTIFICIO"),
      Employee.createEmployee("Suzahne", new Date("02/03/2012"), "Uzal"),
      Employee.createEmployee("CATOR", new Date("08/06/1999"), "Athuluru"),
      Employee.createEmployee("Joye", new Date("11/27/1999"), "Oyler"),

      Employee.createEmployee("Beng", new Date("09/15/2012"), "Ender"),
      Employee.createEmployee("Patience", new Date("12/16/1998"), "Atluri"),
      Employee.createEmployee("Saiful", new Date("08/01/1999"), "Aiello"),
      Employee.createEmployee("Stefan", new Date("09/19/2001"), "Tewell"),
      Employee.createEmployee("nazneen", new Date("10/20/1997"), "AZANCOT"),

      Employee.createEmployee(
        "Hironori",
        new Date("07/29/1997"),
        "Irudhayanathan"
      ),
      Employee.createEmployee("Radhika", new Date("05/29/2007"), "Adeva"),
      Employee.createEmployee("Beau", new Date("04/26/1996"), "Eady"),
      Employee.createEmployee("Edyth", new Date("05/06/1999"), "Dygean"),
      Employee.createEmployee("Spyridon", new Date("11/14/2004"), "Pyzik"),
      Employee.createEmployee("Saekyu", new Date("06/18/2008"), "Aekka"),
      Employee.createEmployee("MATTKE", new Date("07/11/2006"), "Atlmayer"),
      Employee.createEmployee("Liang", new Date("12/25/2007"), "Iacovana"),
      Employee.createEmployee("Raffoul", new Date("05/01/2002"), "Afflebach"),
      Employee.createEmployee("Tavia", new Date("03/28/2001"), "AVENIDO"),

      Employee.createEmployee("Wacira", new Date("08/03/2005"), "Ack"),

      Employee.createEmployee("Andria", new Date("01/08/2006"), "Ndlovu"),
      Employee.createEmployee("Pug", new Date("11/13/1999"), "Ugalde"),
      Employee.createEmployee("SHRUTI", new Date("02/14/2008"), "Hrycko"),
      Employee.createEmployee("Yong-Hwa", new Date("03/03/2002"), "Ontjes"),
      Employee.createEmployee("Yosseph", new Date("03/03/1998"), "Osinuga"),
      Employee.createEmployee("Shih-Tse", new Date("04/05/2000"), "High"),
      Employee.createEmployee("Thommie", new Date("10/16/2006"), "HOMCY"),
      Employee.createEmployee("Bell", new Date("01/11/2005"), "Elenbogen"),
      Employee.createEmployee("Madireddy", new Date("11/20/2008"), "ADAD"),
      Employee.createEmployee("Estle", new Date("07/14/2004"), "Stringer"),
      Employee.createEmployee("Katheleen", new Date("01/21/2008"), "Atturu"),
      Employee.createEmployee(
        "VENKATESWARLU",
        new Date("10/07/2003"),
        "Englehart"
      ),
      Employee.createEmployee("Andres", new Date("06/04/1998"), "Ndungu"),
      Employee.createEmployee("Roseline", new Date("01/01/2002"), "Osteen"),
      Employee.createEmployee("Jolyne", new Date("02/03/1999"), "Oldmixon"),
      Employee.createEmployee("Rennie", new Date("07/22/1999"), "ENESCU"),
      Employee.createEmployee("Jamshid", new Date("02/04/1999"), "Amir"),
      Employee.createEmployee("Harmeet", new Date("12/23/2008"), "Aramburu"),
      Employee.createEmployee("PANNEE", new Date("05/08/1996"), "Andoh"),
      Employee.createEmployee("Vernelle", new Date("08/05/2004"), "Erwin"),
      Employee.createEmployee("Bentley", new Date("08/15/2007"), "Englerth"),
      Employee.createEmployee("Renu", new Date("03/23/2003"), "Engel"),
      Employee.createEmployee("Kamal", new Date("10/04/1997"), "Ameer"),

      Employee.createEmployee("TZYY-SHUH", new Date("09/10/2006"), "Zyne"),
      Employee.createEmployee("Tobias", new Date("01/09/1997"), "Obando Lopez"),
      Employee.createEmployee("MAHAYSAK", new Date("06/09/2005"), "AHARONI"),
      Employee.createEmployee("Pryor", new Date("03/23/2004"), "Ryder"),
      Employee.createEmployee("Harikishan", new Date("11/26/2007"), "ARTAN"),
      Employee.createEmployee("Bhagwan", new Date("03/16/2000"), "Harts"),
      Employee.createEmployee("SOON", new Date("06/01/2000"), "OOSTHUIZEN"),
      Employee.createEmployee("SAICHOL", new Date("07/01/1997"), "Aisenberg"),
      Employee.createEmployee("Glenda", new Date("02/23/2008"), "Leil"),
      Employee.createEmployee("Keenan", new Date("05/03/2002"), "EEddddy@"),
      Employee.createEmployee("Lura", new Date("05/17/1996"), "Urschel"),
      Employee.createEmployee("Vikrant", new Date("03/24/1998"), "Ikpirijar"),
      Employee.createEmployee("Llal", new Date("06/02/1997"), "LAMPROS"),
      Employee.createEmployee("Elia", new Date("04/10/2001"), "Liscum"),
      Employee.createEmployee("Yogesh", new Date("12/13/2003"), "Ogilvie"),
      Employee.createEmployee("Protima", new Date("07/24/2001"), "Roeseler"),
      Employee.createEmployee("Chubby", new Date("01/03/1997"), "Huling"),
      Employee.createEmployee("Jean-Patrick", new Date("09/06/1998"), "Easler"),
      Employee.createEmployee("IMTYAZ", new Date("12/18/1999"), "Mthalane"),
      Employee.createEmployee("Ayoka", new Date("07/15/2008"), "Young"),
      Employee.createEmployee("Aravind", new Date("01/27/2000"), "Raichlin"),
      Employee.createEmployee("Dwight", new Date("08/14/1998"), "Wichmann"),
      Employee.createEmployee("Reigo", new Date("12/22/2006"), "Eisner"),
      Employee.createEmployee(
        "Squiz",
        new Date("02/15/1997"),
        "Quintanilla Attorney"
      ),
      Employee.createEmployee("KEIJO", new Date("06/12/2005"), "eichen"),
      Employee.createEmployee("Monema", new Date("09/13/1996"), "Onaifo"),
      Employee.createEmployee(
        "Gwendolyn",
        new Date("10/04/2008"),
        "Weatherspoon"
      ),
      Employee.createEmployee("Navid", new Date("06/02/2005"), "Avendula"),
      Employee.createEmployee("Marek", new Date("10/16/2007"), "Armott"),
      Employee.createEmployee("BRIJPAL", new Date("09/13/2007"), "Ridzik"),
      Employee.createEmployee("CEYHAN", new Date("03/13/2008"), "Eyerman"),
      Employee.createEmployee("Naohisas", new Date("05/20/2001"), "Aoyagi"),
      Employee.createEmployee(
        "Trew",
        new Date("08/26/2006"),
        "Reichenbach-Schweers"
      ),

      Employee.createEmployee("Rueben", new Date("11/10/1997"), "Uemoto"),
      Employee.createEmployee("Gopal", new Date("09/12/1998"), "Opinya"),
      Employee.createEmployee("Lisenne", new Date("01/23/2006"), "Ishizaka"),
      Employee.createEmployee("Bushra", new Date("04/27/2006"), "Usen"),
      Employee.createEmployee("FAOUZI", new Date("01/27/2001"), "Aoe"),
      Employee.createEmployee("Osbaldo", new Date("12/29/2005"), "Sblendorio"),
      Employee.createEmployee("Dorcas", new Date("02/11/1997"), "Ornstein"),
      Employee.createEmployee("Normie", new Date("02/09/2007"), "Ortolani"),
      Employee.createEmployee("Chen", new Date("05/05/2006"), "Hennan"),
      Employee.createEmployee("Hussian", new Date("04/16/2004"), "User3"),
      Employee.createEmployee("Piyush", new Date("11/13/2005"), "IYADOMI"),
      Employee.createEmployee("GAUDENCIO", new Date("11/14/1998"), "Aumack"),
      Employee.createEmployee("Swiki", new Date("10/03/1999"), "Wihtol"),
      Employee.createEmployee("Vasthie", new Date("07/11/2001"), "Ashurian"),
      Employee.createEmployee("Ryuji", new Date("07/25/2008"), "YUHAS"),
      Employee.createEmployee("Carie", new Date("06/06/2003"), "ARGODALE"),
      Employee.createEmployee("EVELIN", new Date("04/18/1999"), "VENEREO"),
      Employee.createEmployee("WOO", new Date("08/21/2004"), "OOSTHUIZEN"),
      Employee.createEmployee("Caddie", new Date("01/21/2005"), "Adler"),
      Employee.createEmployee("Gabriel", new Date("11/03/1999"), "Abushady"),
      Employee.createEmployee("Kamatchi", new Date("03/04/2002"), "Ambrosey"),
      Employee.createEmployee("MITSUGU", new Date("08/03/2008"), "Italiene"),
      Employee.createEmployee("Pratyush", new Date("09/29/2000"), "Raleigh"),
      Employee.createEmployee("Ritu", new Date("02/04/2008"), "Itagaki"),
      Employee.createEmployee("ROARK", new Date("10/20/2004"), "Oaferina"),
      Employee.createEmployee("Lugean", new Date("03/01/2000"), "Ugbaja"),
      Employee.createEmployee("Remy", new Date("03/17/2001"), "Emerick"),
      Employee.createEmployee("Narsimha", new Date("06/24/2007"), "Arterbury"),
      Employee.createEmployee("Derrek", new Date("08/15/2002"), "Ereckson"),
      Employee.createEmployee("Dennette", new Date("07/24/2008"), "Endl"),
      Employee.createEmployee("Ezio", new Date("05/23/1996"), "ZICHICHI"),
      Employee.createEmployee("Sanjay", new Date("03/14/2006"), "Anksorus"),
      Employee.createEmployee("Shen-Shin", new Date("05/14/2000"), "Hermann"),

      Employee.createEmployee("Siw", new Date("06/03/2002"), "Iwamoto"),
      Employee.createEmployee("MANASA", new Date("07/27/1998"), "ANTHINY"),
      Employee.createEmployee("MIRIAN", new Date("10/19/2004"), "IRANIESQ"),
      Employee.createEmployee("Mohan", new Date("01/31/2001"), "Ohnishi"),
      Employee.createEmployee("Dynah", new Date("11/07/2007"), "YNAYA"),
      Employee.createEmployee(
        "Jerome",
        new Date("03/30/1996"),
        "Erwin Manager"
      ),
      Employee.createEmployee("Tori", new Date("12/03/2001"), "ORTLIEB"),
      Employee.createEmployee("ccccccc", new Date("07/17/2008"), "ccccccc"),
      Employee.createEmployee("Myriam", new Date("03/20/2006"), "Yribarren"),
      Employee.createEmployee("Yukie", new Date("11/05/2002"), "Ukpokodu"),
      Employee.createEmployee("ACHYUT", new Date("04/10/2003"), "Cheetham"),
      Employee.createEmployee("Barri", new Date("10/08/1998"), "Arulmoli"),
      Employee.createEmployee("Gamaliel", new Date("06/16/1999"), "Amiri"),
      Employee.createEmployee("Benji", new Date("09/11/1997"), "Engles"),
      Employee.createEmployee("Hidetoshi", new Date("01/03/2012"), "Idzior"),
      Employee.createEmployee("ACAROL", new Date("11/10/1999"), "Carmell"),
      Employee.createEmployee("Yaw", new Date("07/27/2012"), "Awadalla"),
      Employee.createEmployee("Federico", new Date("10/21/1997"), "Edgell"),
      Employee.createEmployee("Darvia", new Date("05/26/2003"), "Arseniev"),
      Employee.createEmployee("BHAT", new Date("03/29/1997"), "Hanlon"),
      Employee.createEmployee("Ramkumar", new Date("09/18/2000"), "Amabile"),
      Employee.createEmployee("AUGUSTIN", new Date("06/20/2000"), "Ugalde"),
      Employee.createEmployee("Sassan", new Date("02/18/2004"), "Askin"),
      Employee.createEmployee("Sebastian", new Date("04/27/2002"), "Ebato"),
      Employee.createEmployee("Juliann", new Date("08/23/2012"), "ULISLAM"),
      Employee.createEmployee("Lhea", new Date("07/04/2005"), "Heady"),
      Employee.createEmployee("Tamyan", new Date("10/27/1998"), "AMBATIPUDI"),

      Employee.createEmployee("Yongmin", new Date("09/23/2005"), "Ondrusek"),
      Employee.createEmployee(
        "Satheeshkumar",
        new Date("03/30/1998"),
        "ATISHA"
      ),
      Employee.createEmployee("Sudarsan", new Date("11/20/2007"), "Udagawa"),
      Employee.createEmployee("Phuntsok", new Date("04/18/2012"), "Huebert"),
      Employee.createEmployee("Nikki", new Date("06/22/2003"), "Ikpirijar"),

      Employee.createEmployee("Stubby", new Date("03/09/2005"), "Tuhacek"),
      Employee.createEmployee("Maralene", new Date("04/23/1999"), "Arnsberg"),
      Employee.createEmployee("NILAM", new Date("09/14/2003"), "ILYEON"),
      Employee.createEmployee("Artur", new Date("04/14/2003"), "rtrt"),
      Employee.createEmployee("Iza", new Date("10/06/2007"), "Zagury"),
      Employee.createEmployee("Syed", new Date("06/17/1998"), "Yetkin"),
      Employee.createEmployee("Nanci", new Date("05/05/2002"), "Anglum"),
      Employee.createEmployee("Kiley", new Date("08/15/2000"), "ILLOULIAN"),
      Employee.createEmployee("Irene", new Date("01/25/1999"), "Rettig"),
      Employee.createEmployee("prescila", new Date("05/02/2006"), "Renolds"),
      Employee.createEmployee(
        "AttorneyLionel",
        new Date("07/04/1997"),
        "ttgfgyu"
      ),
      Employee.createEmployee("Georgan", new Date("06/09/2004"), "Eovaldi"),
      Employee.createEmployee("RAJKUMAR", new Date("02/16/2007"), "AJAYI"),
      Employee.createEmployee("Thearlene", new Date("10/16/2000"), "Herrman"),
      Employee.createEmployee("Beverly", new Date("11/27/1997"), "Everett"),
      Employee.createEmployee("Buttons", new Date("07/14/2012"), "Utley"),
      Employee.createEmployee("Kelby", new Date("06/29/2000"), "Elmer"),
      Employee.createEmployee("djeffe5763", new Date("05/07/2001"), "Jez"),
      Employee.createEmployee("Moriah", new Date("04/07/2002"), "Oranzo"),
      Employee.createEmployee("UMAKANT", new Date("04/28/2005"), "Marzola"),
      Employee.createEmployee("Stefano", new Date("09/14/2003"), "Tenant"),
      Employee.createEmployee("Tomas", new Date("09/22/1997"), "Omrani"),
      Employee.createEmployee("Cordelia", new Date("08/05/2003"), "ORENTREICH"),
      Employee.createEmployee("LaTonia", new Date("09/27/2005"), "Athar"),
      Employee.createEmployee("DECATUR", new Date("11/10/2003"), "Economou"),
      Employee.createEmployee("Mostapha", new Date("07/06/1998"), "Osmani"),
      Employee.createEmployee("Minhui", new Date("08/31/2006"), "Iniguez"),
      Employee.createEmployee("SHINSAENG", new Date("03/04/2012"), "Hirsche"),
      Employee.createEmployee(
        "CHRISTOPHE",
        new Date("06/29/2008"),
        "Hrusovsky"
      ),
      Employee.createEmployee("Marygrace", new Date("02/23/2001"), "Armes"),
      Employee.createEmployee("ZAIN", new Date("01/26/2002"), "AITON"),
      Employee.createEmployee("Ina", new Date("04/30/2008"), "Navar"),
      Employee.createEmployee("Camella", new Date("08/22/1996"), "Amsz"),

      Employee.createEmployee("Sameera", new Date("06/17/2004"), "Ambhore"),
      Employee.createEmployee("Joy", new Date("12/05/1998"), "Oyler"),
      Employee.createEmployee("Venk", new Date("09/21/1996"), "Enrique"),
      Employee.createEmployee("BAOKUN", new Date("08/03/1998"), "Aoshima"),
      Employee.createEmployee("Sachin", new Date("09/03/1996"), "Acree"),
      Employee.createEmployee("Merea", new Date("10/24/2004"), "Ereli"),
      Employee.createEmployee("Terasa", new Date("08/30/1998"), "Erstad"),
      Employee.createEmployee("Clare", new Date("05/30/2007"), "Lacquement"),
      Employee.createEmployee("Esseye", new Date("06/30/2000"), "SSRINIVASAN"),
      Employee.createEmployee("Viola", new Date("03/23/2005"), "Iovino"),
      Employee.createEmployee("Robertine", new Date("09/25/2000"), "Oberkfell"),
      Employee.createEmployee("Roshan", new Date("10/13/1997"), "Osinuga"),
      Employee.createEmployee("Pamuan", new Date("12/09/1997"), "Amico"),
      Employee.createEmployee("Bertine", new Date("11/29/1999"), "EROGLU"),
      Employee.createEmployee("Mozella", new Date("10/08/1998"), "Ozumba"),
      Employee.createEmployee("Tetsuya", new Date("04/06/1998"), "Etter"),
      Employee.createEmployee("KLAAS", new Date("03/15/2004"), "LaMacchia"),
      Employee.createEmployee("Ilaha", new Date("09/06/2004"), "Lauzerique"),
      Employee.createEmployee("Julio", new Date("10/30/1998"), "Uluc"),
      Employee.createEmployee("Yamile", new Date("09/28/2003"), "Amey"),
      Employee.createEmployee("Subhabrato", new Date("01/13/2003"), "Uber"),
      Employee.createEmployee("Moti", new Date("01/18/2001"), "Oton"),
      Employee.createEmployee("Ronan", new Date("11/17/1996"), "Oniani"),
      Employee.createEmployee("Maple", new Date("07/27/2004"), "Apelewitch"),
      Employee.createEmployee("LAZELL", new Date("07/22/2004"), "Azmi"),
      Employee.createEmployee("Norose", new Date("10/14/1997"), "OROURKE"),
      Employee.createEmployee("Demesha", new Date("05/10/1997"), "Emandi"),
      Employee.createEmployee("Carin", new Date("11/29/2004"), "Aranda"),

      Employee.createEmployee("Emmet", new Date("12/12/2003"), "mmpark79"),
      Employee.createEmployee("Deuk", new Date("11/21/2007"), "Eustis"),
      Employee.createEmployee("Hangwoo", new Date("07/20/2004"), "and Berger"),
      Employee.createEmployee("Carol-Anne", new Date("08/11/1996"), "Arifin"),
      Employee.createEmployee("ATEF", new Date("06/17/2005"), "test4"),
      Employee.createEmployee("Somsri", new Date("07/24/1999"), "Omwenga"),
      Employee.createEmployee("Bertina", new Date("06/09/2006"), "Erker"),

      Employee.createEmployee("Wendolyne", new Date("12/28/2006"), "Ennist"),
      Employee.createEmployee("Minor", new Date("06/06/1997"), "Ingram"),
      Employee.createEmployee("Chacko", new Date("11/16/2007"), "Hatchel"),

      Employee.createEmployee("Ramanarao", new Date("11/18/2006"), "Amy"),
      Employee.createEmployee("Francesca", new Date("03/30/2003"), "Rajca"),
      Employee.createEmployee("Hammond", new Date("05/27/1998"), "Amey"),
      Employee.createEmployee("Benda", new Date("09/02/2002"), "Enzenroth"),
      Employee.createEmployee("Laureen", new Date("11/18/2005"), "Auber"),
      Employee.createEmployee("Lias", new Date("02/21/1996"), "Iannotta"),
      Employee.createEmployee("Emile", new Date("03/31/1996"), "Mitsunari"),
      Employee.createEmployee("Valy", new Date("05/29/2001"), "ALBERENGA"),
      Employee.createEmployee("Hiroki", new Date("11/21/1996"), "Irvin"),
      Employee.createEmployee("Harpeet", new Date("06/21/2000"), "Areton"),
      Employee.createEmployee("FAYEZ", new Date("05/03/2012"), "Aybar-Llenas"),
      Employee.createEmployee("Gerti", new Date("01/08/2007"), "Ernevad"),

      Employee.createEmployee("LICHENG", new Date("05/08/2001"), "Ice"),
      Employee.createEmployee("Callecia", new Date("03/01/2004"), "Allveri"),
      Employee.createEmployee("NAM", new Date("05/08/2007"), "Amorose"),
      Employee.createEmployee(
        "Stamatina",
        new Date("12/31/2000"),
        "TALLAPRAGAD"
      ),
      Employee.createEmployee("Lucile", new Date("08/05/2000"), "Ucles"),

      Employee.createEmployee("Kaven", new Date("07/26/1999"), "Averbach"),
      Employee.createEmployee("Anisur", new Date("03/19/2008"), "Nicolau"),
      Employee.createEmployee("UNA", new Date("12/27/1997"), "Naqvi"),
      Employee.createEmployee("Runelvys", new Date("01/02/2012"), "Understahl"),
      Employee.createEmployee(
        "Kristelle",
        new Date("09/20/1999"),
        "Richards-Kortum"
      ),
      Employee.createEmployee("Abolghasem", new Date("04/19/2007"), "Bool"),
      Employee.createEmployee("Chris", new Date("08/30/2007"), "Hriniak"),
      Employee.createEmployee("Chutuoc", new Date("03/29/2002"), "HUGUES"),
      Employee.createEmployee("Nettie", new Date("07/31/2000"), "Etten"),

      Employee.createEmployee("Aswathy", new Date("05/28/1997"), "Swiech"),

      Employee.createEmployee("Kourosh", new Date("10/03/2003"), "Ouchi"),
      Employee.createEmployee(
        "Jenanne",
        new Date("06/16/1996"),
        "Engels-Churchill"
      ),
      Employee.createEmployee("Darlan", new Date("07/05/2007"), "ARMATAS"),
      Employee.createEmployee(
        "NAFEESUNNISA",
        new Date("11/10/2005"),
        "Afflebach"
      ),
      Employee.createEmployee("Candra", new Date("07/09/2004"), "Ansloan"),
      Employee.createEmployee("Seynabou", new Date("03/16/2001"), "Eyring"),
      Employee.createEmployee("Nicer", new Date("04/13/1996"), "Ickes"),
      Employee.createEmployee("Marini", new Date("05/17/2003"), "Arden"),
      Employee.createEmployee("Pussy", new Date("08/11/2001"), "USI"),
      Employee.createEmployee("JUGAL", new Date("09/12/2002"), "Ugino"),
      Employee.createEmployee("Marketing", new Date("03/11/2000"), "Aresco"),
      Employee.createEmployee("Meenakshi", new Date("03/16/2006"), "Eells"),
      Employee.createEmployee("Basit", new Date("05/15/1996"), "Astorino"),
      Employee.createEmployee(
        "Antonio",
        new Date("03/13/1996"),
        "Ntakirutimana"
      ),
      Employee.createEmployee("Sean", new Date("05/24/2005"), "Eagles"),
      Employee.createEmployee("Maryse", new Date("02/14/2007"), "Archer"),
      Employee.createEmployee("smc01", new Date("10/06/2005"), "McCandless"),
      Employee.createEmployee(
        "Sabyasachi",
        new Date("07/14/2004"),
        "Abrazhevich"
      ),
      Employee.createEmployee("GIOVANNI", new Date("02/04/1998"), "Iosifides"),
      Employee.createEmployee("Lukeman", new Date("07/27/2005"), "Ukman"),
      Employee.createEmployee("Udell", new Date("06/13/2006"), "DEL VECCHIO"),
      Employee.createEmployee("RASHIDA", new Date("07/12/2004"), "ASWAD"),
      Employee.createEmployee("Ivo", new Date("07/31/2008"), "Vohden"),
      Employee.createEmployee("Sugnana", new Date("03/03/2004"), "Ugalde"),
      Employee.createEmployee("Yuhong", new Date("07/16/2004"), "Uhlenkamp"),
      Employee.createEmployee("Pierre", new Date("12/22/2008"), "Iennaco"),
      Employee.createEmployee("Cyd", new Date("04/03/1996"), "Yde"),
      Employee.createEmployee("Sukumar", new Date("08/25/1997"), "Uku"),
      Employee.createEmployee("Pinfen", new Date("11/12/2007"), "Inami"),
      Employee.createEmployee("LaCinda", new Date("06/01/2004"), "Accardo"),
      Employee.createEmployee("Yasukazu", new Date("08/05/2008"), "Ashman"),
      Employee.createEmployee("THEMIS", new Date("04/17/2004"), "Heiser"),
      Employee.createEmployee("Jitender", new Date("03/17/2004"), "ITAKURA"),
      Employee.createEmployee("Tam", new Date("06/02/2001"), "Amble"),
      Employee.createEmployee("JEETA", new Date("03/09/2008"), "Eells"),
      Employee.createEmployee("Wickey", new Date("04/13/2002"), "Ichinomiya"),
      Employee.createEmployee("Rajko", new Date("06/04/2012"), "Ajith"),
      Employee.createEmployee("Ranvir", new Date("07/07/1996"), "Antiuk"),
      Employee.createEmployee(
        "Dror",
        new Date("09/03/2002"),
        "Rodriguez-Bernier"
      ),
      Employee.createEmployee("Kamella", new Date("06/22/2002"), "Amier"),
      Employee.createEmployee("Mukul", new Date("01/05/2007"), "Ukpokodu"),
      Employee.createEmployee(
        "Vaidhyanathan",
        new Date("11/05/1999"),
        "AIVAZIAN"
      ),
      Employee.createEmployee("JIAYUAN", new Date("12/16/2001"), "Iannello"),
      Employee.createEmployee("Curtice", new Date("04/06/2007"), "URBANCZYK"),
      Employee.createEmployee("Leven", new Date("03/23/1999"), "Eveland"),
      Employee.createEmployee("Cirrie", new Date("04/10/2012"), "Irby"),
      Employee.createEmployee("Eunis", new Date("02/08/2007"), "Underhill"),
      Employee.createEmployee("ITI", new Date("01/20/2008"), "Tinklenberg"),
      Employee.createEmployee("Kayley", new Date("05/04/2000"), "Ayer"),
      Employee.createEmployee("Renetta", new Date("08/25/2005"), "Enyenihi"),
      Employee.createEmployee("Edyta", new Date("02/20/2007"), "Dyck"),
      Employee.createEmployee("Milana", new Date("09/22/2004"), "Iles"),
      Employee.createEmployee("Hui", new Date("06/06/2004"), "Uitz"),
      Employee.createEmployee("Shareen", new Date("11/12/1999"), "Harte"),
      Employee.createEmployee("Melgar", new Date("06/21/1998"), "Elsberg"),
      Employee.createEmployee("Abu", new Date("01/10/2004"), "Buggeln"),
      Employee.createEmployee("Lovissa", new Date("01/13/1999"), "Ovena"),
      Employee.createEmployee("HanJu", new Date("06/16/1998"), "Andrieu"),
      Employee.createEmployee("Daman", new Date("07/09/2006"), "Amodio"),
      Employee.createEmployee("Orell", new Date("05/07/2002"), "Regis-Brito"),
      Employee.createEmployee("Moxie", new Date("12/02/2003"), "Oxciano"),
      Employee.createEmployee("Vik", new Date("08/26/2004"), "IKE"),
      Employee.createEmployee("Vaunceil", new Date("07/03/2001"), "Aumiller"),
      Employee.createEmployee("Liese", new Date("06/29/1999"), "Iek"),

      Employee.createEmployee("Tirk", new Date("06/09/1997"), "Ireland"),
      Employee.createEmployee("Omiga", new Date("08/12/2012"), "Miksis"),
      Employee.createEmployee("Chiao", new Date("01/15/2005"), "Hiznay"),
      Employee.createEmployee("Takahito", new Date("05/26/2001"), "Akaike"),
      Employee.createEmployee("JUNGJIN", new Date("03/16/2005"), "Unno"),
      Employee.createEmployee("SAJAD", new Date("01/08/2003"), "Ajenstat"),
      Employee.createEmployee("Haifa", new Date("06/13/1996"), "AITON"),

      Employee.createEmployee("Jianliang", new Date("04/07/2000"), "iavicoli"),
      Employee.createEmployee("Mohgan", new Date("09/01/2006"), "Ohrn-Hicks"),
      Employee.createEmployee("Yelena", new Date("05/08/2012"), "Elkhoury"),
      Employee.createEmployee("Rebeca", new Date("09/07/2005"), "Eberhart"),
      Employee.createEmployee("Gill", new Date("03/24/2007"), "ILER"),
      Employee.createEmployee("Regis", new Date("01/26/1998"), "Eggleton"),
      Employee.createEmployee("PollyAnn", new Date("09/17/2005"), "Olguin"),
      Employee.createEmployee("Elliott", new Date("09/10/2001"), "Llyod"),
      Employee.createEmployee("Roxene", new Date("08/15/1998"), "Oxnevad"),
      Employee.createEmployee("Rufus", new Date("07/27/2006"), "UFFORD"),
      Employee.createEmployee("Rhiannon", new Date("03/25/1996"), "Higaki"),
      Employee.createEmployee("Kalpesh", new Date("03/03/2012"), "ALURI"),
      Employee.createEmployee("Elart", new Date("04/14/2012"), "Lacuesta"),
      Employee.createEmployee("Balasaheb", new Date("02/20/1996"), "Almus"),
      Employee.createEmployee("Tonmoy", new Date("06/10/1999"), "Ontiveros"),
      Employee.createEmployee("Efren", new Date("05/20/1999"), "Franzini"),
      Employee.createEmployee("Dragon", new Date("12/05/2003"), "Raghunandan"),
      Employee.createEmployee(
        "Quinette",
        new Date("04/23/2003"),
        "Uittenbogaard"
      ),
      Employee.createEmployee("Pedro", new Date("02/26/2006"), "Edmondson"),
      Employee.createEmployee("Loraine", new Date("06/08/2001"), "Orlando"),
      Employee.createEmployee("BAZIEL", new Date("06/24/1999"), "Azeem"),
      Employee.createEmployee("Rechelle", new Date("02/03/2003"), "Eckhart"),
      Employee.createEmployee("Pinti", new Date("08/05/2003"), "Insley"),
      Employee.createEmployee("Candis", new Date("09/12/2004"), "Andrulewicz"),
      Employee.createEmployee("Derak", new Date("11/15/2004"), "Ertem"),
      Employee.createEmployee("Darcie", new Date("07/20/2006"), "Arslanian"),
      Employee.createEmployee("Enos", new Date("04/17/2004"), "Noreika"),
      Employee.createEmployee("Karin", new Date("04/10/2008"), "Armendariz"),

      Employee.createEmployee("Hanu", new Date("12/11/2006"), "Andreoni"),
      Employee.createEmployee("SANJA", new Date("02/24/2003"), "Andersson"),
      Employee.createEmployee("Vanburn", new Date("09/21/2012"), "Anliker"),
      Employee.createEmployee("Tiffanie", new Date("10/20/2000"), "Ifurung"),
      Employee.createEmployee("Gayle", new Date("03/10/1999"), "Ayer"),
      Employee.createEmployee("RANJANI", new Date("06/04/2002"), "ANGELUCCI"),
      Employee.createEmployee("Cordula", new Date("10/06/2001"), "Ortmeier"),
      Employee.createEmployee("Mourad", new Date("08/28/1997"), "Ourtiague"),
      Employee.createEmployee("ROITH", new Date("01/28/2005"), "Oishi"),
      Employee.createEmployee("Gerd", new Date("07/26/2009"), "Erstling"),
      Employee.createEmployee("Ogbonna", new Date("04/25/2001"), "Gbalekuma"),
      Employee.createEmployee("Weihua", new Date("06/11/2007"), "EIK"),
      Employee.createEmployee("Ralf", new Date("05/24/2005"), "Althouse"),
      Employee.createEmployee("Loann", new Date("10/05/2000"), "Oana"),
      Employee.createEmployee(
        "Jayshree",
        new Date("06/04/1999"),
        "Ayatollahzadeh"
      ),
      Employee.createEmployee("Natsumi", new Date("12/07/2003"), "Athota"),
      Employee.createEmployee("Deann", new Date("02/20/2001"), "Earls"),
      Employee.createEmployee("Barclay", new Date("01/19/1998"), "Arrabelli"),
      Employee.createEmployee("Asim", new Date("10/03/2005"), "Sider"),
      Employee.createEmployee("Eliyahy", new Date("07/24/2007"), "Lipon"),

      Employee.createEmployee("Timothye", new Date("10/05/1997"), "Imburgia"),
      Employee.createEmployee("Mehdi", new Date("02/05/2008"), "Ehmen"),
      Employee.createEmployee("Tameka", new Date("08/24/2009"), "Amorim"),
      Employee.createEmployee("Leflora", new Date("11/28/2008"), "Efting"),
      Employee.createEmployee("Meeta", new Date("11/11/1997"), "Eechambadi"),
      Employee.createEmployee("Milham", new Date("03/14/1998"), "ILENE"),

      Employee.createEmployee("Anex", new Date("01/21/1996"), "Nelson"),
      Employee.createEmployee("Kanitha", new Date("07/14/2002"), "Anstine"),
      Employee.createEmployee("Daykin", new Date("07/25/2008"), "Aybar-Llenas"),
      Employee.createEmployee("Wendi", new Date("10/11/2000"), "ENGEMAN"),
      Employee.createEmployee("Ulysses", new Date("12/12/2004"), "Lyle"),
      Employee.createEmployee("Dena", new Date("10/17/2001"), "Engelbrecht"),
      Employee.createEmployee("Dietrich", new Date("11/23/2002"), "Ierullo"),
      Employee.createEmployee("Malia", new Date("09/14/2008"), "Alessi"),
      Employee.createEmployee("Susheela", new Date("01/08/1999"), "Usedly"),
      Employee.createEmployee(
        "Young-Gurl",
        new Date("11/17/2004"),
        "Ourtiague"
      ),
      Employee.createEmployee("Adele", new Date("02/18/2000"), "Detrick"),
      Employee.createEmployee("Pao", new Date("08/04/2001"), "AONUMA"),

      Employee.createEmployee("Mosen", new Date("06/17/1996"), "OSELLAME"),
      Employee.createEmployee("WAHEED", new Date("01/03/2006"), "Ahlschwede"),
      Employee.createEmployee(
        "Nanavaty",
        new Date("05/17/2000"),
        "Antonangeli"
      ),
      Employee.createEmployee("Yuping", new Date("04/25/2001"), "Upadhyayula"),
      Employee.createEmployee("Lambertus", new Date("03/22/2007"), "Ameer"),
      Employee.createEmployee("Kanwal", new Date("03/21/2007"), "Ando"),
      Employee.createEmployee("SHIGEYUKI", new Date("07/12/1996"), "Hitt"),
      Employee.createEmployee("Toyin", new Date("01/28/2006"), "Oyer"),
      Employee.createEmployee("Wenchin", new Date("02/18/2007"), "Engfer"),
      Employee.createEmployee("Heidi", new Date("03/18/2002"), "Eide"),
      Employee.createEmployee("Aurea", new Date("02/14/2007"), "Urso"),
      Employee.createEmployee("Bethanne", new Date("01/09/1997"), "Etie"),

      Employee.createEmployee("Muftah", new Date("09/12/2008"), "UFRET"),
      Employee.createEmployee("HIDEHIRO", new Date("09/23/2006"), "Idriss"),
      Employee.createEmployee("Isaiah", new Date("02/24/2003"), "Saurer"),
      Employee.createEmployee("Ailla", new Date("02/23/2000"), "Ilagan"),
      Employee.createEmployee("Nikhil", new Date("11/21/2001"), "IKEGAYA"),
      Employee.createEmployee("Gilberta", new Date("05/16/1998"), "ILANGO"),
      Employee.createEmployee("Hsuan", new Date("11/29/2002"), "Sussillo"),
      Employee.createEmployee("Pravee", new Date("08/28/2009"), "Rahn"),
      Employee.createEmployee("Shirlie", new Date("03/17/1996"), "Hinnergardt"),
      Employee.createEmployee("Roscoe", new Date("02/10/2002"), "Osterli"),

      Employee.createEmployee("Kandan", new Date("06/04/2004"), "Annunziata"),
      Employee.createEmployee("EDUVIGIS", new Date("05/26/2007"), "Dushey"),
      Employee.createEmployee("Sreekumar", new Date("02/22/2006"), "Reznikov"),
      Employee.createEmployee("Sang-Tack", new Date("04/03/1996"), "Anjanappa"),
      Employee.createEmployee("Margerete", new Date("07/28/2000"), "Arana"),
      Employee.createEmployee("Medhat", new Date("07/04/2000"), "EDNALDO"),
      Employee.createEmployee("Roann", new Date("10/05/2000"), "Oana"),
      Employee.createEmployee("Tyrus", new Date("10/06/1996"), "Yribarren"),
      Employee.createEmployee("Sharda", new Date("09/06/1997"), "Hannon"),
      Employee.createEmployee("Doo-Sung", new Date("07/17/2006"), "Oosterman"),
      Employee.createEmployee("Dilcia", new Date("02/14/2007"), "ILLURI"),
      Employee.createEmployee(
        "YASUNORI",
        new Date("03/22/1999"),
        "ashachauhan"
      ),

      Employee.createEmployee("Pascual", new Date("07/24/1998"), "Aspromonte"),
      Employee.createEmployee(
        "Guruprasath",
        new Date("10/21/2006"),
        "UR REHMAN"
      ),
      Employee.createEmployee("Branch", new Date("04/25/2001"), "Rapien"),
      Employee.createEmployee("Karilyn", new Date("04/09/2006"), "Arens"),
      Employee.createEmployee("PRITH", new Date("03/24/2006"), "Riley-Nowlin"),
      Employee.createEmployee("Bao", new Date("05/27/2005"), "Aoe"),
      Employee.createEmployee("Syamala", new Date("03/03/2001"), "YASUNAGA"),
      Employee.createEmployee("Roanna", new Date("11/20/1998"), "Oakcrum"),
      Employee.createEmployee("Dustin", new Date("09/22/1999"), "Usowski"),
      Employee.createEmployee("Nathan", new Date("09/11/2008"), "Atwell"),
      Employee.createEmployee("Marshan", new Date("02/24/2003"), "ARGIZ"),
      Employee.createEmployee("Jonus", new Date("09/27/2008"), "Onodera"),
      Employee.createEmployee("Nick", new Date("08/13/2003"), "ICHIHARA"),
      Employee.createEmployee("Matty", new Date("01/14/2001"), "ATHY"),
      Employee.createEmployee(
        "Bethan",
        new Date("03/07/2004"),
        "Etinoff-Gordon"
      ),
      Employee.createEmployee("Uohn", new Date("09/10/2006"), "Ohrstrom"),
      Employee.createEmployee("Stanlee", new Date("12/11/1998"), "Taillon"),
      Employee.createEmployee("Loyce", new Date("06/06/2009"), "Oyenuga"),
      Employee.createEmployee("Yubin", new Date("10/14/2004"), "Ubieta"),
      Employee.createEmployee("Tarif", new Date("08/21/2002"), "Arnould"),
      Employee.createEmployee("Hayden", new Date("11/09/2008"), "Ayer"),
    ];
  }

  getDepartmentManual() {
    return this.department;
  }

  getCity() {
    return this.address.city;
  }

  getSalaryString() {
    //just createing some random test scenarios
    return this.employeeId === 5
      ? null
      : this.employeeId === 6
        ? "111111"
        : this.annualSalary.toString();
  }

  getHireDateString() {
    return this.employeeId === 5
      ? ""
      : this.hireDate
        ? this.hireDate.toDateString()
        : null;
  }

  getDetails() {
    return `${this.employeeId}. ${this.firstName} ${this.lastName}, ${this.phoneNumber
      }, ${this.department}, ${this.stateCode}, ${formatCurrency(
        this.annualSalary
      )}, ${formatDate(this.hireDate)}`;
  }

  getDisplayName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getDepartmentParameterized() {
    return this.department;
  }
}

Employee.prototype.typeName = Employee.typeName = "Employee"; //for quick inspection
Employee.index = 1;
Employee.allDepartments = [
  { data: "IT", label: "IT" },
  { data: "Accounting", label: "Accounting" },
  { data: "Sales", label: "Sales" },
  { data: "HR", label: "HR" },
];
Employee.areaCodes = ["201", "732", "212", "646"];
Employee.streetTypes = ["Ave", "Blvd", "Rd", "St", "Lane"];
Employee.streetNames = ["Park", "West", "Newark", "King", "Gardner"];
Employee.cities = [
  "Grand Rapids",
  "Albany",
  "Stroudsburgh",
  "Barrie",
  "Springfield",
];
Employee.allStates = [
  { data: "NJ", label: "New Jersey", employees: [] },
  { data: "NY", label: "New York", employees: [] },
  { data: "TX", label: "Texas", employees: [] },
  { data: "CA", label: "California", employees: [] },
];

Employee.employees = Employee.createEmployees();
