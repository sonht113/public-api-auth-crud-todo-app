import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { messageConstants } from 'src/constants';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}
  async create(createTodoDto: CreateTodoDto) {
    try {
      return await this.todoRepository.save({
        id: uuid(),
        ...createTodoDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.todoRepository.find();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOne(id: string) {
    try {
      return await this.todoRepository.findOne({
        where: {
          id,
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<{ status: number; message: string }> {
    try {
      let todo = await this.todoRepository.findOne({
        where: {
          id,
        },
      });
      if (!todo) {
        throw new NotFoundException('Todo not found');
      }
      todo = { ...todo, ...updateTodoDto, updatedAt: new Date() };
      await this.todoRepository.save(todo);
      return {
        status: HttpStatus.OK,
        message: messageConstants.update,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: string): Promise<{ status: number; message: string }> {
    try {
      const todo = await this.todoRepository.findOne({
        where: {
          id,
        },
      });
      if (!todo) {
        throw new NotFoundException('Todo not found');
      }
      await this.todoRepository.remove(todo);
      return {
        status: HttpStatus.OK,
        message: messageConstants.delete,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
