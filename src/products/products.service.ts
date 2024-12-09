import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async updateProductImage(productId: string, imageUrl: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    product.imgUrl = imageUrl;
    return this.productRepository.save(product);
  }

  // Agregar método findAll
  async findAll(): Promise<Product[]> {
    return this.productRepository.find(); // Retorna todos los productos
  }

  // Agregar método update
  async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto); // Actualiza el producto con los nuevos valores
    return this.productRepository.save(product);
  }
}





