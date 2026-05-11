import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinksRepository } from './links.repository'
import type { LinkDocument } from './schemas/link.schema'

const mockLink = {
  _id: 'test-id',
  title: 'Test',
  url: 'https://test.example.com',
  icon: 'test',
  category: 'Other',
  createdAt: new Date(),
} as unknown as LinkDocument

const mockRepo = {
  findAll: jest.fn().mockResolvedValue([mockLink]),
  findById: jest.fn().mockResolvedValue(mockLink),
  create: jest.fn().mockResolvedValue(mockLink),
  update: jest.fn().mockResolvedValue(mockLink),
  delete: jest.fn().mockResolvedValue(true),
  count: jest.fn().mockResolvedValue(1),
  insertMany: jest.fn().mockResolvedValue(undefined),
}

describe('LinksService', () => {
  let service: LinksService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LinksService, { provide: LinksRepository, useValue: mockRepo }],
    }).compile()

    service = module.get(LinksService)
  })

  it('returns all links', async () => {
    const result = await service.findAll()
    expect(result).toHaveLength(1)
    expect(mockRepo.findAll).toHaveBeenCalled()
  })

  it('creates a link', async () => {
    const dto = {
      title: 'Test',
      url: 'https://test.example.com',
      icon: 'test',
      category: 'Other' as const,
    }
    const result = await service.create(dto)
    expect(result).toEqual(mockLink)
  })

  it('throws NotFoundException when updating a non-existent link', async () => {
    mockRepo.update.mockResolvedValueOnce(null)
    await expect(service.update('missing-id', {})).rejects.toThrow(NotFoundException)
  })

  it('throws NotFoundException when deleting a non-existent link', async () => {
    mockRepo.delete.mockResolvedValueOnce(false)
    await expect(service.delete('missing-id')).rejects.toThrow(NotFoundException)
  })
})
