import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getCategories(): Promise<Category[]> {
    return await this.find();  // Devuelve todas las categorías
  }

  async addCategory(categoryData: Category): Promise<Category> {
    const category = this.create(categoryData); // Crea una nueva instancia de Category
    return await this.save(category); // Guarda la nueva categoría en la base de datos
  }
}
