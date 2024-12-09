import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let hashedPassword: string;

  beforeEach(async () => {
    hashedPassword = await bcrypt.hash('password', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign in a user and return an access token', async () => {
    const mockUser: Partial<User> = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      name: 'Test User',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

    const result = await service.signIn('test@example.com', 'password');

    expect(result).toEqual({ accessToken: 'mockAccessToken' });
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: ['id', 'email', 'password', 'role'],
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
      {
        expiresIn: '1h',
      },
    );
  });

  it('should throw UnauthorizedException when email is incorrect', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.signIn('wrong@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'wrong@example.com' },
      select: ['id', 'email', 'password', 'role'],
    });
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    const mockUser: Partial<User> = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      name: 'Test User',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

    await expect(service.signIn('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
  });

  it('should create a user and return it without the password', async () => {
    const mockUser: Partial<User> = {
      id: '1',
      email: 'newuser@example.com',
      password: hashedPassword,
      role: 'user',
      name: 'New User',
      address: '123 Street',
      phone: 1234567890,
      country: 'Country',
      city: 'City',
    };
  
    const savedUser: Omit<User, 'password'> = {
      id: '1',
      email: 'newuser@example.com',
      role: 'user',
      name: 'New User',
      address: '123 Street',
      phone: 1234567890,
      country: 'Country',
      city: 'City',
      orders: [],
    };
  
    jest.spyOn(userRepository, 'create').mockReturnValue(mockUser as User);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as User);
  
    // Aquí añadimos el campo role
    const result = await service.signUp({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'newpassword',
      address: '123 Street',
      phone: 1234567890,
      country: 'Country',
      city: 'City',
      role: 'user',  // <--- Agregado para que coincida con el CreateUserDto
    });
  
    expect(result).toEqual(
      expect.objectContaining({
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        name: savedUser.name,
        address: savedUser.address,
        phone: savedUser.phone,
        country: savedUser.country,
        city: savedUser.city,
      })
    );
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'New User',
      email: 'newuser@example.com',
      password: expect.any(String),
      address: '123 Street',
      phone: 1234567890,
      country: 'Country',
      city: 'City',
      role: 'user',  // <--- Agregado aquí también
    });
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'newuser@example.com',
      }),
    );
  });
  
    
});


