import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { GetLabelsFilterDto } from './dto/get-labels-filter.dto';
import { LabelsRepository } from './labels.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from './label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(LabelsRepository)
    private labelsRepository: LabelsRepository,
  ) {}

  getLabels(filterDto: GetLabelsFilterDto): Promise<Label[]> {
    return this.labelsRepository.getLabels(filterDto);
  }

  async getLabelById(id: string): Promise<Label> {
    const found = await this.labelsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Label with ID "${id}" not found`);
    }

    return found;
  }

  createLabel(createLabelDto: CreateLabelDto): Promise<Label> {
    return this.labelsRepository.createLabel(createLabelDto);
  }

  async deleteLabel(id: string): Promise<void> {
    const result = await this.labelsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Label with ID "${id}" not found`);
    }
  }

  async updateLabel(id: string, name: string): Promise<Label> {
    const label = await this.getLabelById(id);

    label.name = name;
    await this.labelsRepository.save(label);

    return label;
  }
}
