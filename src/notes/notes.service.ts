import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';
import { NotesRepository } from './notes.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NotesRepository)
    private notesRepository: NotesRepository,
  ) {}

  getNotes(filterDto: GetNotesFilterDto): Promise<Note[]> {
    return this.notesRepository.getNotes(filterDto);
  }

  async getNoteById(id: string): Promise<Note> {
    const found = await this.notesRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }

    return found;
  }

  createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.createNote(createNoteDto);
  }

  async deleteNote(id: string): Promise<void> {
    const result = await this.notesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
  }

  async updateNote(id: string, value: string): Promise<Note> {
    const note = await this.getNoteById(id);

    note.value = value;
    await this.notesRepository.save(note);

    return note;
  }
}
