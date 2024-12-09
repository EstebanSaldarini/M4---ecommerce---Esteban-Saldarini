// src/orders/entities/order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order) // Asegúrate de que `order` está en OrderDetail
    orderDetails: OrderDetail[];
}
