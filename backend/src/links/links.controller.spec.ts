import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { LinksController } from './links.controller'
import { LinksService } from './links.service'
import type { LinkDocument } from './schemas/link.schema'

const mockLink = {
  _id: 'test-uuid',
  title: 'Grafana',
  url: 'https://grafana.example.com',
  icon: 'chart-bar',
  category: 'Monitoring',
  createdAt: new Date(),
} as unknown as LinkDocument

const mockLinksService = {
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('LinksController', () => {
  let controller: LinksController

  beforeEach(async () => {
    Object.values(mockLinksService).forEach((fn) => fn.mockReset())

    const module = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [{ provide: LinksService, useValue: mockLinksService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get(LinksController)
  })

  describe('findAll', () => {
    it('returns all links from the service', async () => {
      mockLinksService.findAll.mockResolvedValue([mockLink])

      const result = await controller.findAll()

      expect(result).toEqual([mockLink])
      expect(mockLinksService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('create', () => {
    it('returns the created link', async () => {
      mockLinksService.create.mockResolvedValue(mockLink)

      const dto = {
        title: 'Grafana',
        url: 'https://grafana.example.com',
        icon: 'chart-bar',
        category: 'Monitoring' as const,
      }
      const result = await controller.create(dto)

      expect(result).toEqual(mockLink)
      expect(mockLinksService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('returns the updated link', async () => {
      const updated = { ...mockLink, title: 'Grafana Updated' } as unknown as LinkDocument
      mockLinksService.update.mockResolvedValue(updated)

      const result = await controller.update('test-uuid', { title: 'Grafana Updated' })

      expect(result).toEqual(updated)
      expect(mockLinksService.update).toHaveBeenCalledWith('test-uuid', { title: 'Grafana Updated' })
    })

    it('propagates NotFoundException when link is not found', async () => {
      mockLinksService.update.mockRejectedValue(new NotFoundException())

      await expect(controller.update('missing-id', { title: 'X' })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('delete', () => {
    it('calls the service and returns void', async () => {
      mockLinksService.delete.mockResolvedValue(undefined)

      await expect(controller.delete('test-uuid')).resolves.toBeUndefined()
      expect(mockLinksService.delete).toHaveBeenCalledWith('test-uuid')
    })

    it('propagates NotFoundException when link is not found', async () => {
      mockLinksService.delete.mockRejectedValue(new NotFoundException())

      await expect(controller.delete('missing-id')).rejects.toThrow(NotFoundException)
    })
  })
})
