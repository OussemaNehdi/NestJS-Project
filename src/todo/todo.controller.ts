import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { TodoEntity } from './todo.entity';
import { StatusEnum } from './status.enum';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Create a new todo
  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoService.addTodo(createTodoDto);
  }

  // Update a todo by id
  @Patch(':id')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    return this.todoService.updateTodo(id, updateTodoDto);
  }

  // Get all todos (Exercise 13)
  @Get()
  async getAllTodos(
    @Query('search') search?: string,
    @Query('status') status?: StatusEnum,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<TodoEntity[] | { todos: TodoEntity[]; total: number }> {
    // If page or limit is provided, use paginated version
    if (page !== undefined || limit !== undefined) {
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const [todos, total] = await this.todoService.searchTodosPaginated(
        pageNum,
        limitNum,
        search,
        status,
      );
      return { todos, total };
    }

    // If search or status provided, use search version
    if (search || status) {
      return this.todoService.searchTodos(search, status);
    }

    // Otherwise just get all todos
    return this.todoService.getAllTodos();
  }

  // Get a todo by id (Exercise 14)
  @Get(':id')
  async getTodoById(@Param('id', ParseIntPipe) id: number): Promise<TodoEntity> {
    return this.todoService.getTodoById(id);
  }

  // Soft delete a todo (Exercise 11)
  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.todoService.deleteTodo(id);
    return { message: `Todo with ID ${id} has been soft deleted` };
  }

  // Hard delete a todo
  @Delete(':id/permanent')
  async hardDeleteTodo(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.todoService.hardDeleteTodo(id);
    return { message: `Todo with ID ${id} has been permanently deleted` };
  }

  // Restore a soft-deleted todo
  @Patch(':id/restore')
  async restoreTodo(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.todoService.restoreTodo(id);
    return { message: `Todo with ID ${id} has been restored` };
  }

  // Get counts by status (Exercise 12)
  @Get('stats/count-by-status')
  async getCountByStatus(): Promise<Record<StatusEnum, number>> {
    return this.todoService.countByStatus();
  }
}