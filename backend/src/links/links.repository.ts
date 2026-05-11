import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Link, type LinkDocument } from './schemas/link.schema'
import type { CreateLinkDto } from './dto/create-link.dto'
import type { UpdateLinkDto } from './dto/update-link.dto'

/**
 * Repository layer — all Mongoose I/O lives here so the service stays
 * framework-agnostic and easy to unit-test with a stub.
 */
@Injectable()
export class LinksRepository {
  constructor(@InjectModel(Link.name) private readonly model: Model<LinkDocument>) {}

  async findAll(): Promise<LinkDocument[]> {
    return this.model.find().sort({ createdAt: -1 }).exec()
  }

  async findById(id: string): Promise<LinkDocument | null> {
    return this.model.findById(id).exec()
  }

  async create(dto: CreateLinkDto): Promise<LinkDocument> {
    const doc = new this.model({ _id: uuidv4(), ...dto })
    return doc.save()
  }

  async update(id: string, dto: UpdateLinkDto): Promise<LinkDocument | null> {
    return this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec()
    return result !== null
  }

  async count(): Promise<number> {
    return this.model.countDocuments().exec()
  }

  async insertMany(docs: CreateLinkDto[]): Promise<void> {
    const withIds = docs.map((d) => ({ _id: uuidv4(), ...d }))
    await this.model.insertMany(withIds)
  }
}
