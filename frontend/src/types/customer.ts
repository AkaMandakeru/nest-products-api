export interface Customer {
  _id?: string;
  userId: {
    _id: string;
    email: string;
    name: string;
    document: string;
  };
  code: string;
  name: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  document: string;
  phone?: string;
  address?: string;
}
