import { MinLength, MaxLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { MIN_NOTE_LENGTH, MAX_NOTE_LENGTH } from '../constants'
import { NoteLabel } from '../notes-labels/note-label.entity';


@Entity()
export class Note {
    note: any;
    [x: string]: any;
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @MinLength(MIN_NOTE_LENGTH, {
        message: `Note is too short, min is (${MIN_NOTE_LENGTH} chars)`,
    })
    @MaxLength(MAX_NOTE_LENGTH, {
        message: `Note is too long, max is (${MAX_NOTE_LENGTH} chars)`,
    })
    value: string;

    @OneToMany(() => NoteLabel, (noteLabel) => noteLabel.note, {
         cascade: true,
    })
    labels: NoteLabel[]
}