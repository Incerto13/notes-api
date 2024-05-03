import { MinLength, MaxLength } from 'class-validator';
import { Column } from 'typeorm'
import { MIN_NOTE_LENGTH, MAX_NOTE_LENGTH } from '../../constants'

export class CreateNoteDto {
  @Column()
  @MinLength(MIN_NOTE_LENGTH, {
      message: `Note is too short, min is (${MIN_NOTE_LENGTH} chars)`,
  })
  @MaxLength(MAX_NOTE_LENGTH, {
      message: `Note is too long, max is (${MAX_NOTE_LENGTH} chars)`,
  })
  value: string;
}
