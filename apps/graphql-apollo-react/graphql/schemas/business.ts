import { gql } from 'apollo-server-micro';
export const BusinessSchema = gql`
scalar JSON
scalar JSONObject

type Business {
  business_id: Int
  name: String
  address: String
  city: String
  postal_code: String
  latitude: Float
  longitude: Float
  phone_number: String
  TaxCode: String
  business_certificate: Int
  application_date: String
  owner_name: String
  owner_address: String
  owner_city: String
  owner_state: String
  owner_zip: String
  inspection_count: Int
  violation_count: Int
}
type NameValue {
  name: String!
  value: String!
}


type Query {
  businesses(args: FilterPageSortArguments): ServerResponse!
}
type ServerResponse {
  rows: [Business!]!
  count: Int!
  filterDistinctValues: JSON
  footerValues: JSON
}



input FilterExpressionInput {
  id: String
  col: JSON!
  operation: FilterOperation!
  expression: JSON
  parent: FilterInput
}

input FilterInput {
  id: String
  logicalOperator: String
  children: [FilterExpressionInput!]
  parent: FilterInput
}

enum FilterOperation {
  None
  Equals
  NotEquals
  BeginsWith
  Wildcard
  EndsWith
  Contains
  DoesNotContain
  GreaterThan
  LessThan
  GreaterThanEquals
  LessThanEquals
  InList
  NotInList
  Between
  IsNotNull
  IsNull
}

input PaginationRequestInput {
  pageSize: Int!
  currentPage: Int!
}

input SortInfoInput {
  sortColumn: String
  isAscending: Boolean
}

input ExpansionInput {
  expandedRowIds: [String!]!
}

input FilterPageSortArguments {
  distinctValueColumns: [String!]
  footerValueColumns: [String!]
  filter: FilterInput
  pagination: PaginationRequestInput
  sorts: [SortInfoInput!]
  expansion: ExpansionInput
}

type Query {
  business(id: Int!): Business
  getBusinesses(args: FilterPageSortArguments): [Business!]!
}`;
