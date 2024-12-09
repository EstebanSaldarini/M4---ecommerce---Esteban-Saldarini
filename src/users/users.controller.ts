import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error al crear el usuario.' })
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return { id: newUser.id };
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al crear el usuario.',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  @ApiResponse({ status: 500, description: 'Error al obtener los usuarios.' })
  @ApiBearerAuth()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    try {
      return await this.usersService.findAll(page, limit);
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al obtener los usuarios.',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Detalles del usuario.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error al obtener el usuario.' })
  @ApiBearerAuth()
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Usuario con ID ${id} no encontrado.`,
        };
      }
      return user;
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al obtener el usuario.',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el usuario.' })
  @ApiBearerAuth()
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      if (!updatedUser) {
        throw {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Usuario con ID ${id} no encontrado.`,
        };
      }
      return { id: updatedUser.id };
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al actualizar el usuario.',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error al eliminar el usuario.' })
  @ApiBearerAuth()
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const removed = await this.usersService.remove(id);
      if (!removed) {
        throw {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Usuario con ID ${id} no encontrado.`,
        };
      }
      return { success: true, id };
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al eliminar el usuario.',
        error: error.message,
      };
    }
  }
}

