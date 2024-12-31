import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  fullname: string;

  @IsOptional()
  jobname: string;

  @IsOptional()
  username: string;

  @IsOptional()
  password: string;
}
