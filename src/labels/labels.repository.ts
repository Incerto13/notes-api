import { EntityRepository, Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { GetLabelsFilterDto } from './dto/get-labels-filter.dto';
import { Label } from './label.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Label)
export class LabelsRepository extends Repository<Label> {
    private logger = new Logger('LabelsController');

    async getLabels(filterDto: GetLabelsFilterDto): Promise<Label[]> {
      const { search } = filterDto;
  
      const query = this.createQueryBuilder('label');
  
      if (search) {
        query.andWhere(
          'LOWER(label.name) LIKE LOWER(:search)',
          { search: `%${search}%` },
        );
      }
  
      try {
        const labels = await query.getMany();
        return labels;
      } catch(error) {
        this.logger.error(`Failed to get labels. Filters: ${JSON.stringify(filterDto)}`, error.stack)
        throw new InternalServerErrorException() // ensures error will bubble up to surface
      }
    }
  
    async createLabel(createLabelDto: CreateLabelDto): Promise<Label> {
      const { name } = createLabelDto;
  
      const label = this.create({
        name,
      });
  
      await this.save(label);
      return label;
    }
}