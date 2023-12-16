import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from './auth.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto) {
    return this.authRepository.createUser(authCredentialDto);
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const existingUser = await this.authRepository.findOne({
      where: { username },
    });

    if (
      existingUser &&
      (await bcrypt.compare(password, existingUser.password))
    ) {
      const payload: JwtPayload = { username };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    }

    throw new UnauthorizedException('Please check the credentials to log in');
  }
}
