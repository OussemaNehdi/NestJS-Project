import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { StatusEnum } from './status.enum';
import { ValidationMessages } from '../common/validation-messages';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: ValidationMessages.TODO.NAME.MIN_LENGTH })
  @MaxLength(10, { message: ValidationMessages.TODO.NAME.MAX_LENGTH })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: ValidationMessages.TODO.DESCRIPTION.MIN_LENGTH })
  description?: string;

  @IsOptional()
  @IsEnum(StatusEnum, { message: ValidationMessages.TODO.STATUS.INVALID })
  status?: StatusEnum;
}