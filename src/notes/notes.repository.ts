import { EntityRepository, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';
import { Note } from './note.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Note)
export class NotesRepository extends Repository<Note> {
    private logger = new Logger('NotesController');

    async getNotes(filterDto: GetNotesFilterDto): Promise<Note[]> {
      const { search } = filterDto;
  
      const query = this.createQueryBuilder('note');
  
      if (search) {
        query.andWhere(
          'LOWER(note.value) LIKE LOWER(:search)',
          { search: `%${search}%` },
        );
      }
  
      try {
        const notes = await query.getMany();
        return notes;
      } catch(error) {
        this.logger.error(`Failed to get notes. Filters: ${JSON.stringify(filterDto)}`, error.stack)
        throw new InternalServerErrorException() // ensures error will bubble up to surface
      }
    }
  
    async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
      const { value } = createNoteDto;
  
      const note = this.create({
        value,
      });
  
      await this.save(note);
      return note;
    }
}