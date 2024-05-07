import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';
import { NotesRepository } from './notes.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { NotesLabelsService } from '../notes-labels/notes-labels.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NotesRepository)
    private notesRepository: NotesRepository,
    private notesLabelsService: NotesLabelsService
  ) {}

  getNotes(filterDto: GetNotesFilterDto): Promise<Note[]> {
    return this.notesRepository.getNotes(filterDto);
  }

  async getNoteById(id: string): Promise<Note> {
    const found = await this.notesRepository.getNoteById(id);

    if (!found) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }

    return found;
  }

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = await this.notesRepository.createNote(createNoteDto);
    const { labelIds=[] } = createNoteDto;

    // TODO: replace w/ bulk insert
    if (labelIds?.length > 0) {
      for (const labelId of labelIds ){
        await this.notesLabelsService.createNoteLabel({ labelId, noteId: note.id})
      }
    }

    return this.notesRepository.getNoteById(note.id)
  }

  async deleteNote(id: string): Promise<void> {
    const result = await this.notesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
  }

  async updateNote(id: string, value: string, labelIds: string[]=[]): Promise<Note> {
    const note = await this.getNoteById(id);

    note.value = value;
    await this.notesRepository.save(note);

    const notesLabels = (await this.notesRepository.getNoteById(note.id)).labels

    // cleaer all previous labels (TODO: replace with more elegant solution to only add/remove based on diff)
    if (notesLabels?.length > 0) {
      for (const noteLabel of notesLabels ){
        await this.notesLabelsService.deleteNoteLabel({ labelId: noteLabel.labelId, noteId: note.id})
      }
    }
    
    // add new labels (TODO: replace w/ bulk insert)
    if (labelIds?.length > 0) {
      for (const labelId of labelIds ){
        await this.notesLabelsService.createNoteLabel({ labelId, noteId: note.id})
      }
    }

    return this.notesRepository.getNoteById(note.id)
  }
}
