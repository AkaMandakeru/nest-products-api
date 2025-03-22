export interface Company {
  _id?: string;
  name: string;
  description?: string;
  document: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyResponse {
  hasCompany: boolean;
  company?: Company;
}
