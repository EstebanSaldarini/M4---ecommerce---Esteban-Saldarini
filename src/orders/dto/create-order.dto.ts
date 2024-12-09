// src/orders/dto/create-order.dto.ts

import { IsUUID, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class ProductOrder {
    @IsUUID()
    @IsNotEmpty()
    id: string;  // UUID del producto
}

export class CreateOrderDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;  // UUID del usuario

    @ValidateNested({ each: true })
    @Type(() => ProductOrder)
    products: ProductOrder[];
}
