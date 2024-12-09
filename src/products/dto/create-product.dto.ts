import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber({}, { message: 'El precio debe ser un número.' })
    price: number;

    @IsNumber()
    stock: number;

    @IsString()
    @IsOptional()
    imgUrl?: string;

    @IsUUID()
    @IsOptional()
    category_id?: string; // Campo para asociar el producto con una categoría
}




