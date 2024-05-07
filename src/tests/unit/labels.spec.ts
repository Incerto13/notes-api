import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LabelsRepository } from '../../labels/labels.repository';
import { LabelsService } from '../../labels/labels.service';
import { NotesRepository } from '../../notes/notes.repository';
import { NotesService } from '../../notes/notes.service';
import { NotesLabelsRepository } from '../../notes-labels/notes-labels.repository'
import { NotesLabelsService } from '../../notes-labels/notes-labels.service';
import { mockNotesRepository } from './notes.spec';

export const mockLabelsRepository = () => ({
    getLabels: jest.fn(),
    findOne: jest.fn(),
    createLabel: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
})

const mockNotesLabelsRepository = () => ({
    getNotesLabels: jest.fn(),
})

describe('Labels Unit', () => {
    let labelsService: LabelsService;
    let labelsRepository;

    let notesLabelsService: NotesLabelsService
    let notesLabelsRepository;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LabelsService,
                { provide: LabelsRepository, useFactory: mockLabelsRepository },
                NotesService,
                { provide: NotesRepository, useFactory: mockNotesRepository },
                NotesLabelsService,
                { provide: NotesLabelsRepository, useFactory: mockNotesLabelsRepository },
            ],
        }).compile();

        labelsService = module.get(LabelsService);
        labelsRepository = module.get(LabelsRepository);
        notesLabelsService = module.get(NotesLabelsService)
        notesLabelsRepository = module.get(NotesLabelsRepository)
    });

    describe('getLabels', () => {
        it('calls LabelsRepository.getLabels and returns the result', async () => {
            labelsRepository.getLabels.mockResolvedValue('allLabels')
            // call labelsService.getLabels which should then call the repository's getLabels
            const result = await labelsService.getLabels({});
            expect(result).toEqual('allLabels')
        })
    })

    describe('getLabelById', () => {
        it('calls LabelsRepository.findOne and returns the result', async () => {
            const mockLabel = {
                id: 'someId',
                name: 'label contents...'
            };

            labelsRepository.findOne.mockResolvedValue(mockLabel)
            const result = await labelsService.getLabelById('someId')
            expect(result).toEqual(mockLabel);
        });

        it('calls LabelsRepository.findOne and handles a not-found error', async () => {
            labelsRepository.findOne.mockResolvedValue(null);
            expect(labelsService.getLabelById('someId')).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('createLabel', () => {
        it('calls LabelsRepository.createLabel and returns the result', async () => {
            labelsRepository.createLabel.mockResolvedValue('newLabel')
            // call labelsService.getLabels which should then call the repository's createLabel
            const result = await labelsService.createLabel({ name: 'new label'});
            expect(result).toEqual('newLabel')
        })
    })

    describe('deleteLabel', () => {
        it("calls LabelsRepository.delete and returns nothing if record is deleted", async () => {
            labelsRepository.delete.mockResolvedValue({ affected: 1})
            // call labelsService.getLabels which should then call the repository's delete method
            await labelsService.deleteLabel('someId');
            expect(labelsRepository.delete).toHaveBeenCalled()
            expect(() => labelsService.deleteLabel('someId')).not.toThrow(
                NotFoundException
            )
        })

        it("handles a not-found error if label with that id doesn't exist", async () => {
            labelsRepository.delete.mockResolvedValue({ affected: 0})
            try {
                await labelsService.deleteLabel('someId');
            } catch(err) {
                expect(labelsRepository.delete).toHaveBeenCalled()
                expect(err.message).toEqual('Label with ID "someId" not found')
            }
        })
    })

    describe('updateLabel', () => {
        it('calls LabelsRepository.getLabelById, updates the label and saves it', async () => {
            const mockOrigLabel = {
                id: 'someId',
                name: 'orig label...'
            };

            labelsRepository.findOne.mockResolvedValue(mockOrigLabel)
            const result = await labelsService.updateLabel('someId', 'updated label...')
            expect(result).toEqual({ id: 'someId', name: 'updated label...'});
        });

        it('calls LabelsRepository.getLabelById and handles a not-found error', async () => {
            labelsRepository.findOne.mockResolvedValue(null);
            expect(labelsService.updateLabel('someId', 'updated label...')).rejects.toThrow(
                NotFoundException
            )
        })
    })
});