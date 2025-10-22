import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { StatusEnum } from './status.enum';
import { ValidationMessages } from '../common/validation-messages';

export class CreateTodoDto {
  @IsNotEmpty({ message: ValidationMessages.TODO.NAME.REQUIRED })
  @IsString()
  @MinLength(3, { message: ValidationMessages.TODO.NAME.MIN_LENGTH })
  @MaxLength(10, { message: ValidationMessages.TODO.NAME.MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: ValidationMessages.TODO.DESCRIPTION.REQUIRED })
  @IsString()
  @MinLength(10, { message: ValidationMessages.TODO.DESCRIPTION.MIN_LENGTH })
  description: string;

  @IsEnum(StatusEnum, { message: ValidationMessages.TODO.STATUS.INVALID })
  status: StatusEnum = StatusEnum.TODO;
}