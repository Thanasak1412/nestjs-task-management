import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { FilterDto } from './dto/get-tasks-filter.dto';
import { Task, TASK_STATUS } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: FilterDto) {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task = {
      id: uuidv4(),
      title,
      description,
      status: TASK_STATUS.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TASK_STATUS): Task {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return null;
    }

    this.tasks[index].status = status;

    return this.tasks[index];
  }
}
