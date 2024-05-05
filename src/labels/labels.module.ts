import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsController } from './labels.controller';
import { LabelsRepository } from './labels.repository';
import { LabelsService } from './labels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LabelsRepository])
  ],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
