import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import type { LoginDto } from './dto/login.dto'

export interface JwtPayload {
  sub: string
  username: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const expectedUsername = this.configService.getOrThrow<string>('admin.username')
    const expectedPassword = this.configService.getOrThrow<string>('admin.password')

    if (dto.username !== expectedUsername || dto.password !== expectedPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { sub: 'admin', username: dto.username }
    const access_token = await this.jwtService.signAsync(payload)

    return { access_token }
  }
}
