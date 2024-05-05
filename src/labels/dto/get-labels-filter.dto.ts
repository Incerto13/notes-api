import { IsOptional, IsString } from 'class-validator';

export class GetLabelsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
