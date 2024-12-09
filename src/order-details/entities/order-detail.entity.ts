// src/order-details/entities/order-detail.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int')
    quantity: number;  // Agrega esta propiedad para almacenar la cantidad de productos en el detalle del pedido

    // Relación ManyToOne con Order para establecer la asociación con un pedido
    @ManyToOne(() => Order, order => order.orderDetails)
    order: Order;

    // Relación ManyToOne con Product para referenciar un solo producto
    @ManyToOne(() => Product)
    product: Product; // Cambiado a una relación ManyToOne con Product
}
