// src/orders/orders.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {

    async getOrder(id: string): Promise<Order> {
        return this.findOne({
            where: { id },
            relations: ['orderDetails', 'orderDetails.product'], // Asegúrate de cargar también los detalles y productos asociados
        });
    }

    async addOrder(orderData: Order): Promise<Order> {
        const newOrder = this.create(orderData);
        await this.save(newOrder);
        return newOrder;
    }
}
