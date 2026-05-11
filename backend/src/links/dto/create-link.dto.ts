import { IsString, IsUrl, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator'
import { CATEGORIES, type Category } from '../schemas/link.schema'

export class CreateLinkDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title!: string

  @IsUrl()
  url!: string

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string

  @IsString()
  @MinLength(1)
  icon!: string

  @IsEnum(CATEGORIES)
  category!: Category
}
