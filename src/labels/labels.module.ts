import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsController } from './labels.controller';
import { LabelsRepository } from './labels.repository';
import { LabelsService } from './labels.service';
import { NotesLabelsRepository } from '../notes-labels/notes-labels.repository';
import { NotesRepository } from '../notes/notes.repository';
import { NotesLabelsService } from '../notes-labels/notes-labels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LabelsRepository, NotesRepository, NotesLabelsRepository])
  ],
  controllers: [LabelsController],
  providers: [LabelsService, NotesLabelsService],
})
export class LabelsModule {}
