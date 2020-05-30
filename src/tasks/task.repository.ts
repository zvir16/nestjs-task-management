import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskStatus } from "./task-status.enum";
import { searchTaskDto } from "./dto/search-task.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(searchTaskDto: searchTaskDto, user: User): Promise<Task[]> {
        const { status, search } = searchTaskDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id });

        if(status) {
            query.andWhere('task.status = :status', { status } );

        }

        if(search) {
           query.andWhere('(task.name LIKE :search OR task.description LIKE :search)', { search: `%${search}%` } );
        }

        const tasks = await query.getMany();

        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { name, description } = createTaskDto;

        let task = new Task();
        task.name = name;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;

        return task;
    }

}