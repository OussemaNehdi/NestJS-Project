import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusEnum } from './status.enum';
import { TimeStampedEntity } from '../common/timestamp.entity';

@Entity('todos')
export class TodoEntity extends TimeStampedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ 
    type: 'varchar',
    enum: StatusEnum,
    default: StatusEnum.TODO
  })
  status: StatusEnum;
}