import {  gql } from 'apollo-server-micro';

export const BusinessQuery = gql`query Query($args: FilterPageSortArguments) {
  businesses(args: $args) {
    currentPageData {
      business_id
      name
      address
      city
      postal_code
      latitude
      longitude
      phone_number
      TaxCode
      business_certificate
      application_date
      owner_name
      owner_address
      owner_city
      owner_state
      owner_zip
      inspection_count
      violation_count

    }
    pagination {
      totalRecords
      pageSize
      currentPage
      totalPages
    }
    footerValues 
    filterDistinctValues
  }
}
`;
