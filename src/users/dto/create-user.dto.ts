import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsNumberString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'El nombre del usuario', minLength: 3, maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 80, { message: 'El nombre debe tener entre 3 y 80 caracteres.' })
  name: string;

  @ApiProperty({ description: 'El correo electrónico del usuario' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email: string;

  @ApiProperty({ description: 'La contraseña del usuario' })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message: 'La contraseña debe tener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*), y debe tener entre 8 y 15 caracteres.',
  })
  password: string;

  @ApiProperty({ description: 'La dirección del usuario', minLength: 3, maxLength: 80 })
  @IsString()
  @Length(3, 80, { message: 'La dirección debe tener entre 3 y 80 caracteres.' })
  address: string;

  @ApiProperty({ description: 'El número de teléfono del usuario' })
  @IsNumberString({}, { message: 'El número de teléfono debe ser un número válido.' })
  phone: number;

  @ApiProperty({ description: 'El país del usuario', minLength: 5, maxLength: 20 })
  @IsString()
  @Length(5, 20, { message: 'El país debe tener entre 5 y 20 caracteres.' })
  country: string;

  @ApiProperty({ description: 'La ciudad del usuario', minLength: 5, maxLength: 20 })
  @IsString()
  @Length(5, 20, { message: 'La ciudad debe tener entre 5 y 20 caracteres.' })
  city: string;

  @ApiProperty({ description: 'El rol del usuario', enum: ['user', 'admin'] })
  @IsString()
  @IsIn(['user', 'admin'], {
    message: 'El rol debe ser uno de los siguientes valores: user, admin',
  })
  role: string;
}

export class RegisterUserDto extends CreateUserDto {
  @ApiProperty({ description: 'Confirmación de la contraseña' })
  @IsString()
  confirmPassword: string;
}














