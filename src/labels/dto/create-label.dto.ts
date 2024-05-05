import { MinLength, MaxLength } from 'class-validator';
import { Column } from 'typeorm'
import { MIN_LABEL_LENGTH, MAX_LABEL_LENGTH } from '../../constants'

export class CreateLabelDto {
  @Column()
  @MinLength(MIN_LABEL_LENGTH, {
      message: `Label is too short, min is (${MIN_LABEL_LENGTH} chars)`,
  })
  @MaxLength(MAX_LABEL_LENGTH, {
      message: `Label is too long, max is (${MAX_LABEL_LENGTH} chars)`,
  })
  name: string;
}
