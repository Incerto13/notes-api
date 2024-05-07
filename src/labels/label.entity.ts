import { MinLength, MaxLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { MIN_LABEL_LENGTH, MAX_LABEL_LENGTH } from '../constants'
import { NoteLabel } from '../notes-labels/note-label.entity';


@Entity()
export class Label {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @MinLength(MIN_LABEL_LENGTH, {
        message: `Label is too short, min is (${MIN_LABEL_LENGTH} chars)`,
    })
    @MaxLength(MAX_LABEL_LENGTH, {
        message: `Label is too long, max is (${MAX_LABEL_LENGTH} chars)`,
    })
    name: string;

    @OneToMany(() => NoteLabel, (noteLabel) => noteLabel.label, {
        cascade: true,
    })
    notes: NoteLabel[]
}