import { IsNumber, IsString, IsOptional, IsDecimal, IsUUID } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDecimal()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    imgUrl?: string;

    @IsUUID()
    @IsOptional()
    category_id?: string; // Agregamos el campo para la asociación con una categoría
}
