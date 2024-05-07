import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesRepository } from './notes.repository';
import { NotesService } from './notes.service';
import { NotesLabelsService } from '../notes-labels/notes-labels.service';
import { LabelsRepository } from '../labels/labels.repository';
import { NotesLabelsRepository } from '../notes-labels/notes-labels.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotesRepository, LabelsRepository, NotesLabelsRepository])
  ],
  controllers: [NotesController],
  providers: [NotesService, NotesLabelsService],
})
export class NotesModule {}
