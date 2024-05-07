import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesLabelsController } from './notes-labels.controller';
import { NotesLabelsRepository } from './notes-labels.repository';
import { NotesLabelsService } from './notes-labels.service';
import { NotesModule } from '../notes/notes.module';
import { LabelsModule } from '../labels/labels.module';
import { LabelsRepository } from '../labels/labels.repository';
import { NotesRepository } from '../notes/notes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotesLabelsRepository, NotesRepository, LabelsRepository])
  ],
  controllers: [NotesLabelsController],
  providers: [NotesLabelsService],
})
export class NotesLabelsModule {}
