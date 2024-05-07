import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
  } from '@nestjs/common';
  import { Logger } from '@nestjs/common';
import { NoteLabel } from './note-label.entity';

import { NotesLabelsService } from './notes-labels.service';
import { CreateNoteLabelDto } from './dto/create-note-label.dto';
import { DeleteNoteLabelDto } from './dto/delete-note-label.dto';
  
  @Controller('notes-labels')
  export class NotesLabelsController {
    private logger = new Logger('NotesLabelsController');
  
    constructor(
      private notesLabelsService: NotesLabelsService,
      ) {}
  
    @Get()
    getNotesLabels(): Promise<NoteLabel[]> {
      this.logger.verbose(`Retrieving all notes-labels.`)
      return this.notesLabelsService.getNotesLabels();
    }

    @Post()
    async createNoteLabel(@Body() createNoteLabelDto: CreateNoteLabelDto) {
        this.logger.verbose(`Creating a notes-label with noteId: ${createNoteLabelDto.noteId} and labelId: ${createNoteLabelDto.labelId}.`)
     await this.notesLabelsService.createNoteLabel(createNoteLabelDto);
    }

    @Delete()
    async deleteNoteLabel(@Body() deleteNoteLabel: DeleteNoteLabelDto) {
        this.logger.verbose(`Deleting a notes-label with noteId: ${deleteNoteLabel.noteId} and labelId: ${deleteNoteLabel.labelId}.`)
     await this.notesLabelsService.deleteNoteLabel(deleteNoteLabel);
    }
  }
  