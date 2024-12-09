import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}