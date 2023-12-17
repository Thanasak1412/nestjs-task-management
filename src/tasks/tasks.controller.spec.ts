import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-tasks-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const userMock: User = {
  id: 'test123',
  username: 'TestUsername',
  password: 'TestPassword',
  tasks: [],
};

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;
  let tasksRepository: TaskRepository;

  beforeEach(() => {
    tasksService = new TasksService(tasksRepository);
    tasksController = new TasksController(tasksService);
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const result: Task[] = [
        {
          id: '1',
          title: 'title',
          description: 'description',
          status: 'OPEN' as TaskStatus,
          user: userMock,
        },
      ];

      jest
        .spyOn(tasksService, 'getTasks')
        .mockReturnValue(Promise.resolve(result));

      expect(await tasksController.getTasks({}, userMock)).toBe(result);
    });
  });

  describe('getTaskById', () => {
    it('should return object of task', async () => {
      const result: Task = {
        id: '1',
        title: 'title',
        description: 'description',
        status: 'IN_PROGRESS' as TaskStatus,
        user: userMock,
      };

      jest
        .spyOn(tasksService, 'getTaskById')
        .mockReturnValue(Promise.resolve(result));

      expect(await tasksController.getTaskById('1', userMock)).toBe(result);
    });
  });

  describe('createTask', () => {
    it('should return task', async () => {
      const createTaskDtoMock: CreateTaskDto = {
        title: 'title',
        description: 'description',
      };

      const result: Task = {
        id: '1',
        ...createTaskDtoMock,
        status: 'OPEN' as TaskStatus,
        user: userMock,
      };

      jest
        .spyOn(tasksService, 'createTask')
        .mockReturnValue(Promise.resolve(result));

      expect(await tasksController.createTask(createTaskDtoMock, userMock));
    });
  });

  describe('deleteTask', () => {
    it('should not throw an error', async () => {
      jest
        .spyOn(tasksService, 'deleteTask')
        .mockReturnValue(null as unknown as Promise<void>);

      const res = await tasksController.deleteTask('1', userMock);

      expect(res).toBeNull();
    });
  });

  describe('updateTaskStatus', () => {
    it('should return a task that update', async () => {
      const updateTaskStatusDto: UpdateTaskStatusDto = {
        status: 'DONE' as TaskStatus,
      };

      const result: Task = {
        id: '1',
        title: 'title',
        description: 'description',
        status: 'DONE' as TaskStatus,
        user: userMock,
      };

      jest
        .spyOn(tasksService, 'updateTaskStatus')
        .mockReturnValue(Promise.resolve(result));

      expect(
        await tasksController.updateTaskStatus(
          'id',
          updateTaskStatusDto,
          userMock,
        ),
      ).toBe(result);
    });
  });

  describe('uploadTasks', () => {
    it('should return success', async () => {
      const mockFile = new File(
        ['cooking a lunch', 'include a log of pork'],
        'mockFileName.csv',
        {
          type: 'text/esc',
        },
      ) as unknown as Express.Multer.File;

      const result = {
        message: 'successful',
        status: true,
      };

      jest
        .spyOn(tasksService, 'uploadTasks')
        .mockReturnValue(Promise.resolve(result));

      expect(await tasksController.uploadTasks(mockFile, userMock));
    });
  });
});
