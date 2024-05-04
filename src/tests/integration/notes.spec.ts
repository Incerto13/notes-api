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


  describe('GET /notes', () => {
    describe('200', () => {
        it('should create dog and return id', async () => {
            await connection
            .getRepository(Note)
            .save([{ value: 'note - 1' }, { value: 'note - 2' }, { value: 'note - 3' }]);

            const response = await makeRequest(app).get('/notes');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.map((note) => note.value)).toEqual(["note - 1", "note - 2", "note - 3"])
        });
    });
  });

  describe('GET /notes/:id', () => {
    describe('200', () => {
      it('should return note', async () => {
          const note = await connection
          .getRepository(Note)
          .save({ value: 'note..' });

          const response = await makeRequest(app).get(`/notes/${note.id}`);

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual({
            id: note.id,
            value: note.value
          })
      });
    });

    describe('404', () => {
        it('should handle not-found exception', async () => {
          const note = await connection
          .getRepository(Note)
          .save({ value: 'note..' });
          await connection.getRepository(Note).delete(note.id)

          const response = await makeRequest(app).get(`/notes/${note.id}`);

          expect(response.status).toBe(HttpStatus.NOT_FOUND);
          expect(response.body).toEqual({
            error: 'Not Found',
            statusCode: 404,
            message: `Note with ID \"${note.id}\" not found`
          })
        });
    });
  });

  describe('POST /notes', () => {
        describe('201', () => {
            it('should create note and return id', async () => {
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
                expect(response.body.value).toEqual('hello world...')

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

  describe('PATCH /notes/:id', () => {
      describe('200', () => {
          it('should create note and return id', async () => {
            const orig = await connection
            .getRepository(Note)
            .save({ value: 'original note...' });

            const response = await makeRequest(app).patch(`/notes/${orig.id}`).send({
              value: 'updated note...',
            });

              expect(response.status).toBe(HttpStatus.OK);
              expect(response.body.id).toBe(orig.id);
              expect(response.body.value)

              // check if saved note in database has same properties sent via POST request
              const found = await connection
              .getRepository(Note)
              .findOne(orig.id);

              expect(found).toMatchObject({
                  id: orig.id,
                  value: 'updated note...',
              });
          });
     })
  });

  describe('DELETE /notes/:id', () => {
    describe('200', () => {
        it('should delete note', async () => {
          const note = await connection
          .getRepository(Note)
          .save({ value: 'delete me...' });

            const response = await makeRequest(app).delete(`/notes/${note.id}`);

            expect(response.status).toBe(HttpStatus.OK);

            // check if deleted note is still in database
            const found = await connection
            .getRepository(Note)
            .findOne(note.id);
            expect(found).toBe(undefined);
        });
      })

      describe('404', () => {
        it('should handle not-found exception', async () => {
          const note = await connection
          .getRepository(Note)
          .save({ value: 'note..' });
          await connection.getRepository(Note).delete(note.id)

          const response = await makeRequest(app).delete(`/notes/${note.id}`);

          expect(response.status).toBe(HttpStatus.NOT_FOUND);
          expect(response.body).toEqual({
            error: 'Not Found',
            statusCode: 404,
            message: `Note with ID \"${note.id}\" not found`
          })
        });
      })
    });
});
