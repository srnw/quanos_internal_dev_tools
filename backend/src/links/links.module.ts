import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Link, LinkSchema } from './schemas/link.schema'
import { LinksRepository } from './links.repository'
import { LinksService } from './links.service'
import { LinksController } from './links.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }])],
  providers: [LinksRepository, LinksService],
  controllers: [LinksController],
})
export class LinksModule {}
