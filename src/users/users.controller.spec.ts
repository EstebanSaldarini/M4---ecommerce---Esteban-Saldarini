import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Prueba de integración para el método findAll()
  it('should find all users successfully', async () => {
    const mockUsers = [
      {
        id: '1',
        email: 'testuser1@example.com',
        name: 'Test User 1',
        address: 'Test Address 1',
        phone: 123456789,
        country: 'Testland',
        city: 'Test City',
        role: 'user',
        password: 'hashedPassword1', // Agregamos el campo password
        orders: [],
      },
      {
        id: '2',
        email: 'testuser2@example.com',
        name: 'Test User 2',
        address: 'Test Address 2',
        phone: 987654321,
        country: 'Testland',
        city: 'Test City',
        role: 'user',
        password: 'hashedPassword2', // Agregamos el campo password
        orders: [],
      },
    ];
  
    jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);
  
    const result = await controller.findAll(1, 10);
  
    expect(usersService.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockUsers);
  });
})  




