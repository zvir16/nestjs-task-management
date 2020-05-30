import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { searchTaskDto } from './dto/search-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {

    }

    getTasks(searchTaskDto: searchTaskDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(searchTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const foundOne = await this.taskRepository.findOne({ where: { id, userId: user.id }});

        if(!foundOne) {
            throw new NotFoundException();
        }
                
        return foundOne;
    }

    createNewTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });

        if (!result.affected) {
            throw new NotFoundException(`${id} not found!`);
        }

    }

    async updateStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        let task = await this.getTaskById(id, user);
        task.status = status;
        task.save();

        return task;
    }
}
