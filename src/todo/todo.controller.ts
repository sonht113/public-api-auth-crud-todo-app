import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  @UseGuards(JWTAuthGuard)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Put('/update/:id')
  @UseGuards(JWTAuthGuard)
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete('/delete/:id')
  @UseGuards(JWTAuthGuard)
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
