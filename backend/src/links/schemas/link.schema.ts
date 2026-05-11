import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export const CATEGORIES = [
  'Monitoring',
  'CI/CD',
  'Source Control',
  'Infrastructure',
  'Communication',
  'Documentation',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export type LinkDocument = HydratedDocument<Link>

@Schema({ collection: 'links', versionKey: false })
export class Link {
  @Prop({ type: String, default: uuidv4 })
  _id!: string

  @Prop({ required: true, trim: true })
  title!: string

  @Prop({ required: true, trim: true })
  url!: string

  @Prop({ trim: true })
  description?: string

  @Prop({ required: true })
  icon!: string

  @Prop({ required: true, enum: CATEGORIES })
  category!: Category

  @Prop({ default: () => new Date() })
  createdAt!: Date
}

export const LinkSchema = SchemaFactory.createForClass(Link)
