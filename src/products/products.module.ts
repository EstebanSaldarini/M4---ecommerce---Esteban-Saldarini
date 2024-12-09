import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from '../categories/category.entity';
import { AuthModule } from '../auth/auth.module'; // Importamos el AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    MulterModule.register({
      dest: './uploads/products',
    }),
    AuthModule, // Lo agregamos aquí
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

