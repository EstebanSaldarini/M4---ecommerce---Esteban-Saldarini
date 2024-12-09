import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { IsIn } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 }) // Incrementado para nombres largos
    name: string;

    @Column({ length: 100, unique: true }) // Incrementado para emails largos
    email: string;

    @Column({ length: 100 }) // Incrementado para hashes seguros
    password: string;

    @Column('text', { nullable: true }) // Sin límite
    address: string;

    @Column('bigint', { nullable: true }) // Para números de teléfono largos
    phone: number;

    @Column({ length: 50, nullable: true }) // Incrementado para países largos
    country?: string;

    @Column({ length: 50, nullable: true }) // Incrementado para ciudades largas
    city?: string;

    @Column({ type: 'varchar', length: 50, default: 'user' }) // Incrementado para roles largos
    @IsIn(['user', 'admin'], {
        message: 'El rol debe ser uno de los siguientes valores: user, admin',
    })
    role: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}




