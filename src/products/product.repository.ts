import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from "./entities/product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Método para obtener todos los productos con paginación
  async findAll(skip: number, take: number): Promise<Product[]> {
    return this.productRepository.find({
      skip,
      take
    });
  }

  // Método para agregar nuevos productos
  async addProduct(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  // Método para encontrar un producto por ID
  async findById(id: string): Promise<Product | undefined> {
    return this.productRepository.findOneBy({ id });
  }

  // Método para actualizar un producto
  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findById(id); // Retorna el producto actualizado
  }

  // Método para eliminar un producto
  async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
