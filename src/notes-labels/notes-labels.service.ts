import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotesLabelsRepository } from './notes-labels.repository';
import { NoteLabel } from './note-label.entity';
import { Note } from '../notes/note.entity';
import { Repository } from 'typeorm';
import { Label } from '../labels/label.entity';
import { NotesRepository } from '../notes/notes.repository';
import { LabelsRepository } from '../labels/labels.repository';
import { CreateNoteLabelDto } from './dto/create-note-label.dto';
import { DeleteNoteLabelDto } from './dto/delete-note-label.dto';

@Injectable()
export class NotesLabelsService {
  constructor(
    @InjectRepository(NotesRepository)
    private readonly notesRepository: NotesRepository,
    @InjectRepository(LabelsRepository)
    private readonly labelsRepository: LabelsRepository,
    @InjectRepository(NotesLabelsRepository)
    private notesLabelsRepository: NotesLabelsRepository,
  ) {}

  getNotesLabels(): Promise<NoteLabel[]> {
    return this.notesLabelsRepository.getNotesLabels();
  }

  getNotesLabelsByNoteId(id: string): Promise<NoteLabel[]> {
    return this.notesLabelsRepository.find({ where: {noteId: id }});
  }

  async createNoteLabel(createNoteLabelDto: CreateNoteLabelDto): Promise<NoteLabel> {
    const note = await this.notesRepository.findOne({where: {id: createNoteLabelDto.noteId}});
    const label = await this.labelsRepository.findOne({where: {id: createNoteLabelDto.labelId}})
    if(!note || !label){
        throw new NotFoundException()
    }
    
    const noteLabel = await this.notesLabelsRepository.save(createNoteLabelDto)
    return noteLabel
  }
  

  async deleteNoteLabel(deleteNoteLabelDto: DeleteNoteLabelDto): Promise<void> {
    const result = await this.notesLabelsRepository.delete(deleteNoteLabelDto);

    if (result.affected === 0) {
      throw new NotFoundException(`NoteLabel with noteId: "${deleteNoteLabelDto.noteId}" and labelId: "${deleteNoteLabelDto.labelId}" not found`);
    }
  }
}
