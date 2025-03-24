import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let customerModel: Model<CustomerDocument>;

  const mockCustomerModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken(Customer.name),
          useValue: mockCustomerModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customerModel = module.get<Model<CustomerDocument>>(getModelToken(Customer.name));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const validCompanyId = new Types.ObjectId().toString();

    it('should return empty array when no companyId provided', async () => {
      const result = await service.findAll('');
      expect(result).toEqual([]);
      expect(customerModel.find).not.toHaveBeenCalled();
    });

    it('should return customers for valid companyId', async () => {
      const mockCustomers = [
        { id: '1', name: 'Customer 1' },
        { id: '2', name: 'Customer 2' },
      ];

      mockCustomerModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCustomers),
          }),
        }),
      });

      const result = await service.findAll(validCompanyId);
      expect(result).toEqual(mockCustomers);
      expect(mockCustomerModel.find).toHaveBeenCalledWith({
        companyId: new Types.ObjectId(validCompanyId),
      });
    });

    it('should throw NotFoundException for invalid companyId format', async () => {
      await expect(service.findAll('invalid-id')).rejects.toThrow(NotFoundException);
      expect(customerModel.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const validCompanyId = new Types.ObjectId().toString();
    const validCustomerId = new Types.ObjectId().toString();

    it('should return empty when no companyId provided', async () => {
      await expect(service.findOne('', validCustomerId)).rejects.toThrow(NotFoundException);
      expect(customerModel.findOne).not.toHaveBeenCalled();
    });

    it('should return customer for valid IDs', async () => {
      const mockCustomer = { id: validCustomerId, name: 'Customer 1' };

      mockCustomerModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockCustomer),
        }),
      });

      const result = await service.findOne(validCompanyId, validCustomerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException for invalid companyId format', async () => {
      await expect(service.findOne('invalid-id', validCustomerId)).rejects.toThrow(NotFoundException);
      expect(customerModel.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockCustomerModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne(validCompanyId, validCustomerId)).rejects.toThrow(NotFoundException);
    });
  });
});
