import { MinLength, MaxLength } from 'class-validator';
import { Label } from '../labels/label.entity';
import { Note } from '../notes/note.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class NoteLabel {
    @PrimaryColumn({ name: 'note_id' })
    noteId: string;
  
    @PrimaryColumn({ name: 'label_id' })
    labelId: string;

    @ManyToOne(() => Note, (note) => note.labels, {
        onDelete: 'CASCADE'

    })
    @JoinColumn({ name: 'note_id', referencedColumnName: 'id'})
    note: Note

    @ManyToOne(() => Label, (label) => label.notes, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'label_id', referencedColumnName: 'id'})
    label: Label
}