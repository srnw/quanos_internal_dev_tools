import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

const mockConfigService = {
  getOrThrow: (key: string): string => {
    const map: Record<string, string> = {
      'admin.username': 'admin',
      'admin.password': 'secret',
    }
    return map[key] ?? ''
  },
}

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('returns an access token for valid credentials', async () => {
    const result = await service.login({ username: 'admin', password: 'secret' })
    expect(result.access_token).toBe('signed-token')
  })

  it('throws UnauthorizedException for invalid credentials', async () => {
    await expect(service.login({ username: 'admin', password: 'wrong' })).rejects.toThrow(
      UnauthorizedException,
    )
  })
})
