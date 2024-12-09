import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller'; // Importa el controlador de archivos
import { ProductsService } from '../products/products.service'; // Importa el servicio de productos
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity'; // Importa la entidad Product

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Asegúrate de que Product esté importado para TypeORM
  providers: [PicturesService, ProductsService], // Agrega ProductsService aquí
  controllers: [PicturesController], // Registra FilesController aquí
  exports: [PicturesService],
})
export class PicturesModule {}
