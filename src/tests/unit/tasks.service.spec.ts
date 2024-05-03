import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';
import { TaskStatus } from '../../tasks/task-status.enum';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
})

const mockUser = {
    username: 'Ariel', 
    id: 'someId',
    password: 'somePassword',
    tasks: [],
}

describe('TaskService', () => {
    let tasksService: TasksService;
    let tasksRepository;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TasksRepository, useFactory: mockTasksRepository }
            ],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and returns the result', async () => {
            tasksRepository.getTasks.mockResolvedValue('someValue')
            // call tasksService.getTasks which should then call the repository's getTasks
            const result = await tasksService.getTasks(null);
            expect(result).toEqual('someValue')
        })
    })

    describe('getTasksById', () => {
        it('calls TasksRepository.findOne and returns the result', async () => {
            const mockTask = {
                title: 'Test title',
                description: 'Test doc',
                id: 'someId',
                status: TaskStatus.OPEN,
            };

            tasksRepository.findOne.mockResolvedValue(mockTask)
            const result = await tasksService.getTaskById('someId')
            expect(result).toEqual(mockTask);
        });

        it('calls TasksRepository.findOne and handles an error', async () => {
            tasksRepository.findOne.mockResolvedValue(null);
            // expect(tasksService.getTaskById('someId')).toBe(5) ==> delete
            // expect(tasksService.getTaskById('someId')).rejects.toThrow(
            //     NotFoundException
            // )

        })
    })
});