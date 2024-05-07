import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import { CreateNoteDto } from './dto/create-note.dto';
  import { UpdateNoteDto } from './dto/update-note.dto';
  import { GetNotesFilterDto } from './dto/get-notes-filter.dto';
  import { Note } from './note.entity';
  import { NotesService } from './notes.service';
  import { Logger } from '@nestjs/common';
  
  @Controller('notes')
  export class NotesController {
    private logger = new Logger('NotesController');
  
    constructor(
      private notesService: NotesService,
      ) {}
  
    @Get()
    getNotes(@Query() filterDto: GetNotesFilterDto): Promise<Note[]> {
      this.logger.verbose(`Retrieving all notes. Filters: ${JSON.stringify(filterDto)}`)
      return this.notesService.getNotes(filterDto);
    }
  
    @Get('/:id')
    getNoteById(@Param('id') id: string): Promise<Note> {
      return this.notesService.getNoteById(id);
    }
  
    @Post()
    createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
      // in real app would want to santiize any potential PII from logs
      this.logger.verbose(`Creating a new note. Data: ${JSON.stringify(createNoteDto)}`)
      return this.notesService.createNote(createNoteDto);
    }
  
    @Delete('/:id')
    deleteNote(@Param('id') id: string): Promise<void> {
      return this.notesService.deleteNote(id);
    }
  
    @Patch('/:id')
    updateNote(
      @Param('id') id: string,
      @Body() updateNoteDto: UpdateNoteDto,
    ): Promise<Note> {
        const { value, labelIds } = updateNoteDto;
      return this.notesService.updateNote(id, value, labelIds);
    }
  }
  