import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TaskStatus } from '../task.model';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  readonly status?: TaskStatus;

  @IsOptional()
  @IsString()
  readonly search?: string;
}
