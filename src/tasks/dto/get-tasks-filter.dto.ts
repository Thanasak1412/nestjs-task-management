import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  readonly status?: TaskStatus;

  @IsOptional()
  @IsString()
  readonly search?: string;
}
