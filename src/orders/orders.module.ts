// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository'; // Importa el nuevo repositorio

@Module({
    imports: [TypeOrmModule.forFeature([Order])], // Asegúrate de registrar la entidad Order
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository], // Agrega OrdersRepository a los proveedores
})
export class OrdersModule {}
