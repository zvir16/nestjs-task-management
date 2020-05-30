import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, NotFoundException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { searchTaskDto } from './dto/search-task.dto';
import { TaskStatusValidationPipe } from './pipes/pipe-validation';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(
        private taskService: TasksService
        ) {}

    @Get()
    getTask(
        @Query(ValidationPipe) searchTaskDto: searchTaskDto,
        @GetUser() user: User
        ): Promise<Task[]> {
        return this.taskService.getTasks(searchTaskDto, user);
    }

    @Get('/:id')
    gettaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createNewTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
        ): Promise<Task> {
        return this.taskService.createNewTask(createTaskDto, user);

    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<void> {
      return this.taskService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
        ): Promise<Task> {
        return this.taskService.updateStatus(id, status, user);
    }
}
