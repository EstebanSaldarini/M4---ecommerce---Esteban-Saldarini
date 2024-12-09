import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    // Validar que el archivo exista
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validar tipo de archivo (solo se permite jpg, jpeg y png)
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG and PNG files are allowed');
    }

    // Validar tamaño del archivo (máximo 200 KB)
    const maxSize = 200 * 1024; // 200 KB en bytes
    if (file.size > maxSize) {
      throw new BadRequestException('File size should not exceed 200 KB');
    }

    return file;
  }
}
