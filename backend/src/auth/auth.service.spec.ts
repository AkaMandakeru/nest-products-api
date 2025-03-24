import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  let jwtService: JwtService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      document: '123456',
    };

    it('should successfully register a new user', async () => {
      const createdUser = {
        id: new Types.ObjectId().toString(),
        ...registerDto,
        toJSON: () => ({ ...registerDto, id: 'user-id' }),
      };

      mockUserModel.findOne.mockResolvedValueOnce(null);
      mockUserModel.create.mockResolvedValueOnce(createdUser);
      mockJwtService.sign.mockReturnValueOnce('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('token', 'jwt-token');
      expect(result.user).toMatchObject({
        email: registerDto.email,
        name: registerDto.name,
        document: registerDto.document,
        companyId: '', // Should always be empty string for new users
      });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...registerDto,
        password: expect.any(String), // Hashed password
      });
    });

    it('should throw UnauthorizedException for existing email', async () => {
      mockUserModel.findOne.mockResolvedValueOnce({ email: registerDto.email });
      await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    const userId = new Types.ObjectId().toString();

    it('should return user with empty companyId', async () => {
      const user = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        document: '123456',
      };

      mockUserModel.findById.mockResolvedValueOnce(user);

      const result = await service.validateUser(userId);
      expect(result).toHaveProperty('companyId', '');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);
      await expect(service.validateUser(userId)).rejects.toThrow(UnauthorizedException);
    });
  });
});
