import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    try {
      const tasks = await this.taskRepository.getTasks(filterDto, user);

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks by ${user.username}, to filter by ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    try {
      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to update tasks by user: ${user.username}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  async uploadTasks(fileContents: string[], user: User) {
    const isSuccess = fileContents.every(async (line) => {
      const lines = line.trim().split(',');

      const nonEmptyLines = lines.filter((item) => item.trim());

      if (Array.isArray(nonEmptyLines) && nonEmptyLines.length) {
        const [title, description] = nonEmptyLines;
        const createTaskDto: CreateTaskDto = { title, description };

        try {
          const task = await this.taskRepository.createTask(
            createTaskDto,
            user,
          );

          if (task) {
            return true;
          }
        } catch (error) {
          this.logger.error(
            `Failed to upload tasks by user: ${user.username}`,
            error.stack,
          );

          throw new InternalServerErrorException();
        }
      }
    });

    return { message: 'Successful', status: isSuccess };
  }
}
