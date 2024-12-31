import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { messageConstants } from 'src/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    try {
      const users = await this.userRepository.find();

      return users.map((user) => {
        return {
          id: user.id,
          fullname: user.fullname,
          jobname: user.jobname,
          username: user.username,
        };
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        jobname: user.jobname,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOneByUsername(username: string) {
    try {
      return await this.userRepository.findOne({
        where: {
          username,
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async create(body: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save({
        id: uuid(),
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async update(
    id: string,
    body: UpdateUserDto,
  ): Promise<{ status: number; message: string }> {
    try {
      let user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user = { ...user, ...body, updatedAt: new Date() };
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: messageConstants.update,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
