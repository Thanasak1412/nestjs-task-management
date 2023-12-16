import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User is already exists');
      }

      throw new InternalServerErrorException();
    }
  }
}