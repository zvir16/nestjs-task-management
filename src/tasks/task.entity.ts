import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { User } from "../auth/user.entity";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.task, { eager: false })
    user: User;
}