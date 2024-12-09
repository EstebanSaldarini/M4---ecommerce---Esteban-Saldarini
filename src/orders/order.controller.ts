import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    try {
      return await this.ordersService.findAll();
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving orders',
        error: error.message,
      };
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) { // Validación de UUID
    try {
      return await this.ordersService.findOne(id);
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving order',
        error: error.message,
      };
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.addOrder(createOrderDto);
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating order',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string, // Validación de UUID
    @Body() orderData: Partial<Order>
  ) {
    try {
      return await this.ordersService.update(id, orderData);
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating order',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) { // Validación de UUID
    try {
      return await this.ordersService.remove(id);
    } catch (error) {
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting order',
        error: error.message,
      };
    }
  }
}
