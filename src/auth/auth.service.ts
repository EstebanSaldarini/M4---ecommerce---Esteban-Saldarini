import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Método para registrar usuarios
  async signUp(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      // Validar rol antes de continuar
      if (!['user', 'admin'].includes(userData.role)) {
        userData.role = 'user'; // Asignar valor por defecto si no es válido
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crear y guardar el usuario
      const user = this.userRepository.create({ ...userData, password: hashedPassword });
      const savedUser = await this.userRepository.save(user);

      // Retornar el usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error al crear el usuario:', error);

      // Manejar error por duplicado
      if (error.code === '23505') {
        throw new BadRequestException('El correo electrónico ya está registrado.');
      }

      // Lanzar error genérico si es otro caso
      throw new BadRequestException('Error al crear el usuario.');
    }
  }

  // Método para iniciar sesión
  async signIn(email: string, password: string): Promise<{ accessToken: string }> {
    // Buscar al usuario por email, seleccionando los campos necesarios
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    // Validar la contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    // Generar el token de acceso con el rol del usuario
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken };
  }
}













