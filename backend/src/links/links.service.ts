import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common'
import { LinksRepository } from './links.repository'
import type { LinkDocument } from './schemas/link.schema'
import type { CreateLinkDto } from './dto/create-link.dto'
import type { UpdateLinkDto } from './dto/update-link.dto'
import { SEED_LINKS } from './seed-data'

@Injectable()
export class LinksService implements OnModuleInit {
  private readonly logger = new Logger(LinksService.name)

  constructor(private readonly linksRepository: LinksRepository) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.linksRepository.count()
    if (existing === 0) {
      try {
        await this.linksRepository.insertMany(SEED_LINKS)
        this.logger.log(`Seeded ${SEED_LINKS.length} links into the database`)
      } catch (err: unknown) {
        // A concurrent replica won the race and already inserted the seed data;
        // duplicate-key errors (11000) are benign here.
        if ((err as { code?: number }).code !== 11000) throw err
        this.logger.log('Seed skipped — links already present (duplicate key)')
      }
    }
  }

  findAll(): Promise<LinkDocument[]> {
    return this.linksRepository.findAll()
  }

  async create(dto: CreateLinkDto): Promise<LinkDocument> {
    return this.linksRepository.create(dto)
  }

  async update(id: string, dto: UpdateLinkDto): Promise<LinkDocument> {
    const updated = await this.linksRepository.update(id, dto)
    if (!updated) {
      throw new NotFoundException(`Link with id "${id}" not found`)
    }
    return updated
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.linksRepository.delete(id)
    if (!deleted) {
      throw new NotFoundException(`Link with id "${id}" not found`)
    }
  }
}
