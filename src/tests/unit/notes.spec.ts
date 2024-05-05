import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NotesRepository } from '../../notes/notes.repository';
import { NotesService } from '../../notes/notes.service';

const mockNotesRepository = () => ({
    getNotes: jest.fn(),
    findOne: jest.fn(),
    createNote: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
})

describe('Notes Unit', () => {
    let notesService: NotesService;
    let notesRepository;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                NotesService,
                { provide: NotesRepository, useFactory: mockNotesRepository }
            ],
        }).compile();

        notesService = module.get(NotesService);
        notesRepository = module.get(NotesRepository);
    });

    describe('getNotes', () => {
        it('calls NotesRepository.getNotes and returns the result', async () => {
            notesRepository.getNotes.mockResolvedValue('allNotes')
            // call notesService.getNotes which should then call the repository's getNotes
            const result = await notesService.getNotes({});
            expect(result).toEqual('allNotes')
        })
    })

    describe('getNoteById', () => {
        it('calls NotesRepository.findOne and returns the result', async () => {
            const mockNote = {
                id: 'someId',
                value: 'note contents...'
            };

            notesRepository.findOne.mockResolvedValue(mockNote)
            const result = await notesService.getNoteById('someId')
            expect(result).toEqual(mockNote);
        });

        it('calls NotesRepository.findOne and handles a not-found error', async () => {
            notesRepository.findOne.mockResolvedValue(null);
            expect(notesService.getNoteById('someId')).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('createNote', () => {
        it('calls NotesRepository.createNote and returns the result', async () => {
            notesRepository.createNote.mockResolvedValue('newNote')
            // call notesService.getNotes which should then call the repository's createNote
            const result = await notesService.createNote({ value: 'new note'});
            expect(result).toEqual('newNote')
        })
    })

    describe('deleteNote', () => {
        it("calls NotesRepository.delete and returns nothing if record is deleted", async () => {
            notesRepository.delete.mockResolvedValue({ affected: 1})
            // call notesService.getNotes which should then call the repository's delete method
            await notesService.deleteNote('someId');
            expect(notesRepository.delete).toHaveBeenCalled()
            expect(() => notesService.deleteNote('someId')).not.toThrow(
                NotFoundException
            )
        })

        it("handles a not-found error if note with that id doesn't exist", async () => {
            notesRepository.delete.mockResolvedValue({ affected: 0})
            try {
                await notesService.deleteNote('someId');
            } catch(err) {
                expect(notesRepository.delete).toHaveBeenCalled()
                expect(err.message).toEqual('Note with ID "someId" not found')
            }
        })
    })

    describe('updateNote', () => {
        it('calls NotesRepository.getNoteById, updates the note and saves it', async () => {
            const mockOrigNote = {
                id: 'someId',
                value: 'orig contents...'
            };

            notesRepository.findOne.mockResolvedValue(mockOrigNote)
            const result = await notesService.updateNote('someId', 'updated contents...')
            expect(result).toEqual({ id: 'someId', value: 'updated contents...'});
        });

        it('calls NotesRepository.getNoteById and handles a not-found error', async () => {
            notesRepository.findOne.mockResolvedValue(null);
            expect(notesService.updateNote('someId', 'updated contents...')).rejects.toThrow(
                NotFoundException
            )
        })
    })
});