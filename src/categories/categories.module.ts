import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],  // Registra la entidad Category con TypeORM
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService]  // Exporta el servicio para uso externo si es necesario
})
export class CategoriesModule {}

