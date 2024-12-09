import { Controller, Param, Post, UploadedFile, UseInterceptors, UsePipes, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PicturesService } from './pictures.service';
import { ProductsService } from '../products/products.service';
import { ImageValidationPipe } from './image-validation.pipe'; // Importa el pipe de validación

@Controller('files')
export class PicturesController {
  constructor(
    private readonly picturesService: PicturesService,
    private readonly productsService: ProductsService, // Servicio para actualizar el producto
  ) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ImageValidationPipe()) // Usa el pipe para validar tipo y tamaño de la imagen
  async uploadAndUpdateProductImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Subir la imagen a Cloudinary
    const uploadResult = await this.picturesService.uploadImage(file);

    // Actualizar el producto en la base de datos con la URL de la imagen
    const updatedProduct = await this.productsService.updateProductImage(
      productId,
      uploadResult.secure_url,
    );

    return {
      message: 'Image uploaded and product updated successfully',
      product: updatedProduct,
    };
  }
}
