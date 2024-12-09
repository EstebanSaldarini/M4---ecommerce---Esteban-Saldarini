import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto, RegisterUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: LoginUserDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: RegisterUserDto) {
    const { confirmPassword, ...userData } = signUpDto;

    // Validar que las contraseñas coincidan
    if (userData.password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    // Llamar al servicio de autenticación para registrar al usuario
    return this.authService.signUp(userData);
  }
}











