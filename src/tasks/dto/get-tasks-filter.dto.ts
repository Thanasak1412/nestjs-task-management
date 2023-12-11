import { TASK_STATUS } from '../task.model';

export class FilterDto {
  readonly status?: TASK_STATUS;
  readonly search?: string;
}
