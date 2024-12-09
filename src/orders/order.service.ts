import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '../orders/entities/order.entity'; // Ajusta la ruta relativa según sea necesario
import { OrderDetail } from '../order-details/entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>
    ) {}

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find({ relations: ['orderDetails', 'orderDetails.product', 'user'] });
    }

    async findOne(id: string): Promise<Order> {
        return this.orderRepository.findOneBy({ id });
    }

    async addOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const user = await this.userRepository.findOneBy({ id: createOrderDto.userId });
        if (!user) throw new NotFoundException('User not found');

        const order = new Order();
        order.user = user;
        order.orderDetails = [];

        for (const prod of createOrderDto.products) {
            const product = await this.productRepository.findOneBy({ id: prod.id });
            if (!product || product.stock <= 0) continue;

            const orderDetail = new OrderDetail();
            orderDetail.product = product; // Ahora debe funcionar porque la propiedad `product` existe
            orderDetail.price = product.price;
            orderDetail.quantity = 1; // Asigna una cantidad o la lógica necesaria

            product.stock -= 1; // Decrementa el stock
            await this.productRepository.save(product);
            await this.orderDetailRepository.save(orderDetail);
            order.orderDetails.push(orderDetail);
        }

        if (order.orderDetails.length === 0) {
            throw new Error('No products with available stock were found');
        }

        return this.orderRepository.save(order);
    }

    async update(id: string, orderData: Partial<Order>): Promise<Order> {
        await this.orderRepository.update(id, orderData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.orderRepository.delete(id);
    }
}
