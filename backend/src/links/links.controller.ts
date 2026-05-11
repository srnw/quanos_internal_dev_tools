import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { LinksService } from './links.service'
import { CreateLinkDto } from './dto/create-link.dto'
import { UpdateLinkDto } from './dto/update-link.dto'
import type { LinkDocument } from './schemas/link.schema'

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  findAll(): Promise<LinkDocument[]> {
    return this.linksService.findAll()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateLinkDto): Promise<LinkDocument> {
    return this.linksService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateLinkDto): Promise<LinkDocument> {
    return this.linksService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.linksService.delete(id)
  }
}
