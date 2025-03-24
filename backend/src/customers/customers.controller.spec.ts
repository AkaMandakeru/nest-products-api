import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CompaniesService } from '../companies/companies.service';
import { Types } from 'mongoose';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customersService: CustomersService;
  let companiesService: CompaniesService;

  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCompaniesService = {
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
    companiesService = module.get<CompaniesService>(CompaniesService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const userId = new Types.ObjectId().toString();
    const companyId = new Types.ObjectId().toString();
    const createCustomerDto = {
      name: 'Test Customer',
      email: 'test@example.com',
      document: '123456',
      phone: '123456789',
    };

    it('should create a customer when user has a company', async () => {
      const mockCompany = { id: companyId };
      mockCompaniesService.findByUserId.mockResolvedValueOnce(mockCompany);
      mockCustomersService.create.mockResolvedValueOnce({ id: 'customer-id', ...createCustomerDto });

      const result = await controller.create(createCustomerDto, { user: { id: userId } });

      expect(companiesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(customersService.create).toHaveBeenCalledWith(companyId, createCustomerDto);
      expect(result).toHaveProperty('id', 'customer-id');
    });

    it('should return null when user has no company', async () => {
      mockCompaniesService.findByUserId.mockRejectedValueOnce(new Error('Not found'));

      const result = await controller.create(createCustomerDto, { user: { id: userId } });

      expect(companiesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(customersService.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    const userId = new Types.ObjectId().toString();
    const companyId = new Types.ObjectId().toString();

    it('should return all customers when user has a company', async () => {
      const mockCustomers = [
        { id: '1', name: 'Customer 1' },
        { id: '2', name: 'Customer 2' },
      ];
      const mockCompany = { id: companyId };

      mockCompaniesService.findByUserId.mockResolvedValueOnce(mockCompany);
      mockCustomersService.findAll.mockResolvedValueOnce(mockCustomers);

      const result = await controller.findAll({ user: { id: userId } });

      expect(companiesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(customersService.findAll).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(mockCustomers);
    });

    it('should return empty array when user has no company', async () => {
      mockCompaniesService.findByUserId.mockRejectedValueOnce(new Error('Not found'));

      const result = await controller.findAll({ user: { id: userId } });

      expect(companiesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(customersService.findAll).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const userId = new Types.ObjectId().toString();
    const companyId = new Types.ObjectId().toString();
    const customerId = new Types.ObjectId().toString();

    it('should return a customer when user has a company', async () => {
      const mockCustomer = { id: customerId, name: 'Customer 1' };
      const mockCompany = { id: companyId };

      mockCompaniesService.findByUserId.mockResolvedValueOnce(mockCompany);
      mockCustomersService.findOne.mockResolvedValueOnce(mockCustomer);

      const result = await controller.findOne(customerId, { user: { id: userId } });

      expect(companiesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(customersService.findOne).toHaveBeenCalledWith(companyId, customerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should return null when user has no company', async () => {
      mockCompaniesService.findByUserId.mockRejectedValueOnce(new Error('Not found'));

      const result = await controller.findOne(customerId, { user: { id: userId } });

      expect(companiesService.findByUserId).toHaveBeenCalledWith(userId);
      expect(customersService.findOne).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
