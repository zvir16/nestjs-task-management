import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { searchTaskDto } from './dto/search-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException, createParamDecorator } from '@nestjs/common';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    updateTask: jest.fn()
});

const mockUser = { id: 12, username: 'Test User' };

describe('TaskService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        let module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('get all tasks from repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filter: searchTaskDto = {status: TaskStatus.IN_PROGRESS, search: ''};
            const result = await tasksService.getTasks(filter, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('some value');
        });

     
    });

    describe('getTaskById', () => {
        it('call taskRepository.findOne() and succesfully retrive and return the task', async () => {
            const mockTask ={title: 'Title task', description: 'Title desc'}
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id }})

        });

        it('throw an exception as task is not found ', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create Task', () => {
        it('call taskRepository.createTask() and succesfully create and return task', async () => {
            const createdTask = {
                name: 'Test name',
                description: 'Test description'

            };
            taskRepository.createTask.mockResolvedValue('some value');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const task = await tasksService.createNewTask( createdTask, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createdTask, mockUser);
            expect(task).toEqual('some value');
            
        })
    });

    describe('deleteTask', () => {
        it('call taskRepository.deleteTask()', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1});
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTaskById(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id});

        })

        it('call taskRepository.deleteTask()', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0});
            expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow();
        })
    });

    describe('updateTask', () => {
        it('call taskRepository.updateTask() and update task status', async () => {
            const save = jest.fn().mockResolvedValue(true);

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();

            const result = await tasksService.updateStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        })
    });
});