import { IsString, IsUrl, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CATEGORIES, type Category } from '../schemas/link.schema'

export class CreateLinkDto {
  @ApiProperty({ example: 'Grafana', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title!: string

  @ApiProperty({ example: 'https://grafana.example.com' })
  @IsUrl()
  url!: string

  @ApiPropertyOptional({ example: 'Metrics and dashboards', maxLength: 300 })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string

  @ApiProperty({ example: 'mdi:chart-line', description: 'Icon identifier (e.g. Material Design Icons name)' })
  @IsString()
  @MinLength(1)
  icon!: string

  @ApiProperty({ enum: CATEGORIES, example: 'Monitoring' })
  @IsEnum(CATEGORIES)
  category!: Category
}
