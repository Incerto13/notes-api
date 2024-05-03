import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Connection } from 'typeorm';
import { clearAllTables } from '../utils/clear-all-tables';
import { createTestApp } from '..//utils/create-test-app.util';
import { NotesModule } from '../../notes/notes.module';
import { Note } from '../../notes/note.entity'
import { makeRequest } from '../utils/make-request';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';

describe('Notes Integration', () => {
  let app: NestExpressApplication;
  let connection: Connection;

  beforeAll(async () => {
    const testApp = await createTestApp([NotesModule]);

    connection = testApp.connection;
    app = testApp.app;
  });

  afterEach(async () => {
    await clearAllTables(connection);
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });


  describe('POST /dogs', () => {
        describe('201', () => {
            it('should create dog and return id', async () => {
                const response = await makeRequest(app).post('/notes').send({
                value: 'hello world...',
                });

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.body.id).toBeDefined();
            });

            it('should create note and save it to db', async () => {
                const given: CreateNoteDto = {
                    value: 'hello world...',
                };

                const response = await makeRequest(app).post('/notes').send(given);

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.body.id).toBeDefined();

                // check if saved note in database has same properties sent via POST request
                const found = await connection
                .getRepository(Note)
                .findOne(response.body.id);

                expect(found).toMatchObject({
                    id: response.body.id,
                    value: given.value,
                });
            });
        });
    });
});