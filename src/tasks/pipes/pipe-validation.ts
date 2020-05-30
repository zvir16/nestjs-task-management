import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly validStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value: any) {
        value = value.toUpperCase();

        if(!this.isValidStatus(value)) {
            throw new BadRequestException(`${value} is not valid status`);
        }
        
        return value;
    }

    private isValidStatus(value) {
        const idx = this.validStatus.indexOf(value);
        return idx !== -1;
    }
}