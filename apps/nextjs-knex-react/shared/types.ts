export interface Business {

  business_id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  phone_number: number;
  TaxCode: string;
  business_certificate: number;
  application_date: string;
  owner_name: string;
  owner_address: string;
  owner_city: string;
  owner_state: string;
  owner_zip: string;
}

export interface Inspection {

  business_id: number;
  Score: number;
  date: string;
  type: string;
}

export interface Violation {

  business_id: number;
  date: string;
  ViolationTypeID: string;
  risk_category: string;
  description: string;
}
