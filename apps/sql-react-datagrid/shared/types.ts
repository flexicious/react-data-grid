import { camelCaseToSpace, ColumnOptions, createColumn, FilterOperation, LockMode } from "@euxdt/grid-core";
import { createDateFilterOptions, createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, createTriStateCheckBoxFilterOptions } from "@euxdt/grid-react";

export const distinctValueColumns = [
  "schools.CDSCode",
  "schools.StatusType",
  "schools.County",
  "schools.City",
  "schools.FundingType",
  "schools.DOCType",
  "schools.SOCType",
  "schools.EdOpsName",
  "schools.EILName",
  "schools.Virtual",
  "schools.GSoffered",
  "schools.GSoffered",
  "frpm_new.AcademicYear",
  "frpm_new.CountyCode",
  "frpm_new.DistrictType",
  "frpm_new.SchoolType",
  "frpm_new.EducationalOptionType",
  "frpm_new.NSLPProvisionStatus",
  "frpm_new.CharterFundingType",
  "satscores.rtype",
];

export const makeStringColumn = (fld: string): ColumnOptions => ({
  ...createColumn(fld, "string", camelCaseToSpace(fld.split(".")[1])),
  filterOptions: distinctValueColumns.includes(fld) ? createMultiSelectFilterOptions() :
      createTextInputFilterOptions(FilterOperation.BeginsWith),
});

export const makeNumberColumn = (fld: string): ColumnOptions => ({
  ...createColumn(fld, "number", camelCaseToSpace(fld.split(".")[1])),
  filterOptions: createNumericRangeFilterOptions(),
});

export const makeDateColumn = (fld: string): ColumnOptions => ({
  ...createColumn(fld, "date", camelCaseToSpace(fld.split(".")[1])),
  filterOptions: createDateFilterOptions(),
});

export const makeBooleanColumn = (fld: string): ColumnOptions => ({
  ...createColumn(fld, "boolean", camelCaseToSpace(fld.split(".")[1])),
  filterOptions: createTriStateCheckBoxFilterOptions(),
});



export interface School {
  CDSCode: string;
  NCESDist?: string;
  NCESSchool?: string;
  StatusType: string;
  County: string;
  District: string;
  School?: string;
  Street?: string;
  StreetAbr?: string;
  City?: string;
  Zip?: string;
  State?: string;
  MailStreet?: string;
  MailStrAbr?: string;
  MailCity?: string;
  MailZip?: string;
  MailState?: string;
  Phone?: string;
  Ext?: string;
  Website?: string;
  OpenDate?: Date;
  ClosedDate?: Date;
  Charter: boolean;
  CharterNum?: string;
  FundingType?: string;
  DOC: string;
  DOCType: string;
  SOC?: string;
  SOCType: string;
  EdOpsCode?: string;
  EdOpsName?: string;
  EILCode?: string;
  EILName?: string;
  GSoffered?: string;
  GSserved?: string;
  Virtual?: string;
  Magnet: boolean;
  Latitude?: number;
  Longitude?: number;
  AdmFName1?: string;
  AdmLName1?: string;
  AdmEmail1?: string;
  AdmFName2?: string;
  AdmLName2?: string;
  AdmEmail2?: string;
  AdmFName3?: string;
  AdmLName3?: string;
  AdmEmail3?: string;
  LastUpdate: Date;
}

export const schoolColumns: ColumnOptions[] = [
  {...makeStringColumn("schools.District"), lockMode: LockMode.Left},
  {...makeStringColumn("schools.School"), lockMode: LockMode.Left},
  makeStringColumn("schools.CDSCode"),
  makeStringColumn("schools.NCESDist"),
  makeStringColumn("schools.NCESSchool"),
  makeStringColumn("schools.StatusType"),
  makeStringColumn("schools.County"),
  makeStringColumn("schools.Street"),
  makeStringColumn("schools.StreetAbr"),
  makeStringColumn("schools.City"),
  makeStringColumn("schools.Zip"),
  makeStringColumn("schools.State"),
  makeStringColumn("schools.MailStreet"),
  makeStringColumn("schools.MailStrAbr"),
  makeStringColumn("schools.MailCity"),
  makeStringColumn("schools.MailZip"),
  makeStringColumn("schools.MailState"),
  makeStringColumn("schools.Phone"),
  makeStringColumn("schools.Ext"),
  makeStringColumn("schools.Website"),
  makeDateColumn("schools.OpenDate"),
  makeDateColumn("schools.ClosedDate"),
  makeBooleanColumn("schools.Charter"),
  makeStringColumn("schools.CharterNum"),
  makeStringColumn("schools.FundingType"),
  makeStringColumn("schools.DOC"),
  makeStringColumn("schools.DOCType"),
  makeStringColumn("schools.SOC"),
  makeStringColumn("schools.SOCType"),
  makeStringColumn("schools.EdOpsCode"),
  makeStringColumn("schools.EdOpsName"),
  makeStringColumn("schools.EILCode"),
  makeStringColumn("schools.EILName"),
  makeStringColumn("schools.GSoffered"),
  makeStringColumn("schools.GSserved"),
  makeStringColumn("schools.Virtual"),
  makeBooleanColumn("schools.Magnet"),
  makeNumberColumn("schools.Latitude"),
  makeNumberColumn("schools.Longitude"),
  makeStringColumn("schools.AdmFName1"),
  makeStringColumn("schools.AdmLName1"),
  makeStringColumn("schools.AdmEmail1"),
  makeStringColumn("schools.AdmFName2"),
  makeStringColumn("schools.AdmLName2"),
  makeStringColumn("schools.AdmEmail2"),
  makeStringColumn("schools.AdmFName3"),
  makeStringColumn("schools.AdmLName3"),
  makeStringColumn("schools.AdmEmail3"),
  makeDateColumn("schools.LastUpdate"),
];



export interface FrpmNew {
  AcademicYear: string;
  CountyCode: string;
  DistrictCode: number;
  SchoolCode: string;
  CountyName: string;
  DistrictName: string;
  SchoolName: string;
  DistrictType: string;
  SchoolType: string;
  EducationalOptionType: string;
  NSLPProvisionStatus: string;
  CharterSchoolYN: boolean;
  CharterSchoolNumber: string;
  CharterFundingType: string;
  IRC: boolean;
  LowGrade: string;
  HighGrade: string;
  EnrollmentK12: number;
  FreeMealCountK12: number;
  PercentEligibleFreeK12: number;
  FRPMCountK12: number;
  PercentEligibleFRPMK12: number;
  EnrollmentAges517: number;
  FreeMealCountAges517: number;
  PercentEligibleFreeAges517: number;
  FRPMCountAges517: number;
  PercentEligibleFRPMAges517: number;
}


export const frpmNewColumns: ColumnOptions[] = [
  makeStringColumn("frpm_new.AcademicYear"),
  makeStringColumn("frpm_new.CountyCode"),
  makeNumberColumn("frpm_new.DistrictCode"),
  makeStringColumn("frpm_new.SchoolCode"),
  makeStringColumn("frpm_new.CountyName"),
  makeStringColumn("frpm_new.DistrictName"),
  makeStringColumn("frpm_new.SchoolName"),
  makeStringColumn("frpm_new.DistrictType"),
  makeStringColumn("frpm_new.SchoolType"),
  makeStringColumn("frpm_new.EducationalOptionType"),
  makeStringColumn("frpm_new.NSLPProvisionStatus"),
  makeBooleanColumn("frpm_new.CharterSchoolYN"),
  makeStringColumn("frpm_new.CharterSchoolNumber"),
  makeStringColumn("frpm_new.CharterFundingType"),
  makeBooleanColumn("frpm_new.IRC"),

  makeStringColumn("frpm_new.LowGrade"),
  makeStringColumn("frpm_new.HighGrade"),

  makeNumberColumn("frpm_new.EnrollmentK12"),
  makeNumberColumn("frpm_new.FreeMealCountK12"),
  makeNumberColumn("frpm_new.PercentEligibleFreeK12"),
  makeNumberColumn("frpm_new.FRPMCountK12"),
  makeNumberColumn("frpm_new.PercentEligibleFRPMK12"),

  makeNumberColumn("frpm_new.EnrollmentAges517"),
  makeNumberColumn("frpm_new.FreeMealCountAges517"),
  makeNumberColumn("frpm_new.PercentEligibleFreeAges517"),
  makeNumberColumn("frpm_new.FRPMCountAges517"),
  makeNumberColumn("frpm_new.PercentEligibleFRPMAges517"),
];







export interface SATScore {
  cds: string;
  rtype: string;
  sname?: string;
  dname?: string;
  cname?: string;
  enroll12: number;
  numTstTakr: number;
  avgScrRead?: number;
  avgScrMath?: number;
  avgScrWrite?: number;
  numGE1500?: number;
  pctGE1500?: number;
}

export const satScoreColumns: ColumnOptions[] = [
  makeStringColumn("satscores.cds"),
  makeStringColumn("satscores.rtype"),
  makeStringColumn("satscores.sname"),
  makeStringColumn("satscores.dname"),
  makeStringColumn("satscores.cname"),
  makeNumberColumn("satscores.enroll12"),
  makeNumberColumn("satscores.numTstTakr"),
  makeNumberColumn("satscores.avgScrRead"),
  makeNumberColumn("satscores.avgScrMath"),
  makeNumberColumn("satscores.avgScrWrite"),
  {...makeNumberColumn("satscores.numGE1500"), lockMode: LockMode.Right, width:90},
  {...makeNumberColumn("satscores.pctGE1500"), lockMode: LockMode.Right, width:90},
];
export const numericColumns = [...frpmNewColumns, ...satScoreColumns, ...schoolColumns].filter(c => c.format === "number");

export const initialVisibleColumnsFields = [
  "schools.CDSCode",
  "schools.NCESDist",
  "schools.NCESSchool",
  "schools.StatusType",
  "schools.County",
  "schools.District",
  "schools.School",
  "schools.FundingType",
  "schools.DOCType",
  "schools.SOCType",
  "schools.EILName",
  "schools.Virtual",
  "schools.GSoffered",
  "schools.GSoffered",
  "frpm_new.AcademicYear",
  "frpm_new.CountyCode",
  "frpm_new.SchoolCode",
  "frpm_new.CountyName",
  "frpm_new.DistrictName",
  "frpm_new.SchoolName",
  "frpm_new.DistrictType",
  "frpm_new.SchoolType",
  "frpm_new.EducationalOptionType",
  "frpm_new.NSLPProvisionStatus",
  "frpm_new.CharterSchoolYN",
  "frpm_new.IRC",
  "frpm_new.EnrollmentK12",
  "frpm_new.FreeMealCountK12",
  "frpm_new.PercentEligibleFreeK12",
  "frpm_new.FRPMCountK12",
  "frpm_new.PercentEligibleFRPMK12",
  "frpm_new.EnrollmentAges517",
  "frpm_new.FreeMealCountAges517",
  "frpm_new.PercentEligibleFreeAges517",
  "frpm_new.FRPMCountAges517",
  "frpm_new.PercentEligibleFRPMAges517",
  "satscores.rtype",
  "satscores.sname",
  "satscores.dname",
  "satscores.cname",
  "satscores.enroll12",
  "satscores.numTstTakr",
  "satscores.avgScrRead",
  "satscores.avgScrMath",
  "satscores.avgScrWrite",
  "satscores.numGE1500",
  "satscores.pctGE1500",
];
