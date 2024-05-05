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
  import { CreateLabelDto } from './dto/create-label.dto';
  import { UpdateLabelDto } from './dto/update-label.dto';
  import { GetLabelsFilterDto } from './dto/get-labels-filter.dto';
  import { Label } from './label.entity';
  import { LabelsService } from './labels.service';
  import { Logger } from '@nestjs/common';
  
  @Controller('labels')
  export class LabelsController {
    private logger = new Logger('LabelsController');
  
    constructor(
      private labelsService: LabelsService,
      ) {}
  
    @Get()
    getLabels(@Query() filterDto: GetLabelsFilterDto): Promise<Label[]> {
      this.logger.verbose(`Retrieving all labels. Filters: ${JSON.stringify(filterDto)}`)
      return this.labelsService.getLabels(filterDto);
    }
  
    @Get('/:id')
    getLabelById(@Param('id') id: string): Promise<Label> {
      return this.labelsService.getLabelById(id);
    }
  
    @Post()
    createLabel(@Body() createLabelDto: CreateLabelDto): Promise<Label> {
      // in real app would want to santiize any potential PII from logs
      this.logger.verbose(`Creating a new label. Data: ${JSON.stringify(createLabelDto)}`)
      return this.labelsService.createLabel(createLabelDto);
    }
  
    @Delete('/:id')
    deleteLabel(@Param('id') id: string): Promise<void> {
      return this.labelsService.deleteLabel(id);
    }
  
    @Patch('/:id')
    updateLabel(
      @Param('id') id: string,
      @Body() updateLabelDto: UpdateLabelDto,
    ): Promise<Label> {
        const { name } = updateLabelDto;
      return this.labelsService.updateLabel(id, name);
    }
  }
  