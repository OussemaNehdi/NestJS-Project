import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { StatusEnum } from './status.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  // Exercise 8: Add a Todo
  async addTodo(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);
  }

  // Exercise 9: Update a Todo
  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    // Update the entity
    this.todoRepository.merge(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  // Exercise 10: Delete a Todo (hard delete)
  async hardDeleteTodo(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  // Exercise 11: Soft delete a Todo
  async deleteTodo(id: number): Promise<void> {
    const result = await this.todoRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  // Exercise 11: Restore a deleted Todo
  async restoreTodo(id: number): Promise<void> {
    const result = await this.todoRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found or not deleted`);
    }
  }

  // Exercise 12: Count todos by status
  async countByStatus(): Promise<Record<StatusEnum, number>> {
    const counts: Record<StatusEnum, number> = {
      [StatusEnum.TODO]: 0,
      [StatusEnum.IN_PROGRESS]: 0,
      [StatusEnum.DONE]: 0,
    };

    // Get counts for each status
    const results = await this.todoRepository
      .createQueryBuilder('todo')
      .select('todo.status', 'status')
      .addSelect('COUNT(todo.id)', 'count')
      .groupBy('todo.status')
      .getRawMany();

    // Map results to our counts object
    results.forEach((result) => {
      counts[result.status] = parseInt(result.count, 10);
    });

    return counts;
  }

  // Exercise 13: Get all todos
  async getAllTodos(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }

  // Exercise 14: Get todo by ID
  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  // Exercise 15: Search todos by name, description, and status
  async searchTodos(search?: string, status?: StatusEnum): Promise<TodoEntity[]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    // Apply search filter if provided
    if (search) {
      queryBuilder.andWhere(
        '(todo.name LIKE :search OR todo.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply status filter if provided
    if (status) {
      queryBuilder.andWhere('todo.status = :status', { status });
    }

    return queryBuilder.getMany();
  }

  // Exercise 16: Paginated search
  async searchTodosPaginated(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    status?: StatusEnum
  ): Promise<[TodoEntity[], number]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    // Apply search filter if provided
    if (search) {
      queryBuilder.andWhere(
        '(todo.name LIKE :search OR todo.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply status filter if provided
    if (status) {
      queryBuilder.andWhere('todo.status = :status', { status });
    }

    // Add pagination
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    // Execute query and return results with total count
    return queryBuilder.getManyAndCount();
  }
}