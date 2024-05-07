import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { NoteLabel } from './note-label.entity';
import { CreateNoteLabelDto } from './dto/create-note-label.dto';

@EntityRepository(NoteLabel)
export class NotesLabelsRepository extends Repository<NoteLabel> {
    private logger = new Logger('NotesLabelsController');

    async getNotesLabels(): Promise<NoteLabel[]> {
      const query = this.createQueryBuilder('note-label');
  
      try {
        const notesLabels = await query.getMany();
        return notesLabels;
      } catch(error) {
        this.logger.error(`Failed to get notes-labels.`, error.stack)
        throw new InternalServerErrorException() // ensures error will bubble up to surface
      }
    }
}