import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const mockAuthService = {
  login: jest.fn(),
}

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    mockAuthService.login.mockReset()

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get(AuthController)
  })

  it('returns an access token for valid credentials', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'signed-token' })

    const result = await controller.login({ username: 'admin', password: 'secret' })

    expect(result).toEqual({ access_token: 'signed-token' })
    expect(mockAuthService.login).toHaveBeenCalledWith({ username: 'admin', password: 'secret' })
  })

  it('propagates UnauthorizedException from AuthService', async () => {
    mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'))

    await expect(controller.login({ username: 'admin', password: 'wrong' })).rejects.toThrow(
      UnauthorizedException,
    )
  })
})
