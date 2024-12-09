import {
  Controller,
  Post,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  UseGuards,
  Body,
  Get, // Importamos Get
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard'; // Importamos el RoleGuard

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      if (!file) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'File not provided',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const imageUrl = `/uploads/products/${file.filename}`;
      const updatedProduct = await this.productsService.updateProductImage(
        id,
        imageUrl,
      );

      return response.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error uploading image',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard, RoleGuard) // Protegemos esta ruta con RoleGuard para solo admins
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @Res() response: Response,
  ) {
    try {
      const updatedProduct = await this.productsService.update(id, updateProductDto);
      return response.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating product',
        error: error.message,
      });
    }
  }

  // Agregar método findAll
  @Get() // Añadir el endpoint GET para encontrar todos los productos
  async findAll(@Res() response: Response) {
    try {
      const products = await this.productsService.findAll();
      return response.status(HttpStatus.OK).json(products);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving products',
        error: error.message,
      });
    }
  }
}





