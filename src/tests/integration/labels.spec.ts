import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Connection } from 'typeorm';
import { clearAllTables } from '../utils/clear-all-tables';
import { createTestApp } from '..//utils/create-test-app.util';
import { LabelsModule } from '../../labels/labels.module';
import { Label } from '../../labels/label.entity'
import { makeRequest } from '../utils/make-request';
import { CreateLabelDto } from '../../labels/dto/create-label.dto';

describe('Labels Integration', () => {
  let app: NestExpressApplication;
  let connection: Connection;

  beforeAll(async () => {
    const testApp = await createTestApp([LabelsModule]);

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


  describe('GET /labels', () => {
    describe('200', () => {
        it('should create dog and return id', async () => {
            await connection.getRepository(Label).save({ name: 'label - 1' }) 
            await connection.getRepository(Label).save({ name: 'label - 2' })
            await connection.getRepository(Label).save({ name: 'label - 3' });

            const response = await makeRequest(app).get('/labels');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.map((label) => label.name)).toContain("label - 1")
            expect(response.body.map((label) => label.name)).toContain("label - 2")
            expect(response.body.map((label) => label.name)).toContain("label - 3")
        });
    });
  });

  describe('GET /labels/:id', () => {
    describe('200', () => {
      it('should return label', async () => {
          const label = await connection
          .getRepository(Label)
          .save({ name: 'label..' });

          const response = await makeRequest(app).get(`/labels/${label.id}`);

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual({
            id: label.id,
            name: label.name
          })
      });
    });

    describe('404', () => {
        it('should handle not-found exception', async () => {
          const label = await connection
          .getRepository(Label)
          .save({ name: 'things' });
          await connection.getRepository(Label).delete(label.id)

          const response = await makeRequest(app).get(`/labels/${label.id}`);

          expect(response.status).toBe(HttpStatus.NOT_FOUND);
          expect(response.body).toEqual({
            error: 'Not Found',
            statusCode: 404,
            message: `Label with ID \"${label.id}\" not found`
          })
        });
    });
  });

  describe('POST /labels', () => {
        describe('201', () => {
            it('should create label and return id', async () => {
                const response = await makeRequest(app).post('/labels').send({
                name: 'new label',
                });

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.body.id).toBeDefined();
            });

            it('should create label and save it to db', async () => {
                const given: CreateLabelDto = {
                    name: 'new label'
                };

                const response = await makeRequest(app).post('/labels').send(given);

                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.body.id).toBeDefined();
                expect(response.body.name).toEqual('new label')

                // check if saved label in database has same properties sent via POST request
                const found = await connection
                .getRepository(Label)
                .findOne(response.body.id);

                expect(found).toMatchObject({
                    id: response.body.id,
                    name: given.name,
                });
            });
        });
    });

  describe('PATCH api/labels/:id', () => {
      describe('200', () => {
          it('should create label and return id', async () => {
            const orig = await connection
            .getRepository(Label)
            .save({ name: 'original label' });

            const response = await makeRequest(app).patch(`/labels/${orig.id}`).send({
              name: 'updated label',
            });

              expect(response.status).toBe(HttpStatus.OK);
              expect(response.body.id).toBe(orig.id);
              expect(response.body.value)

              // check if saved label in database has same properties sent via POST request
              const found = await connection
              .getRepository(Label)
              .findOne(orig.id);

              expect(found).toMatchObject({
                  id: orig.id,
                  name: 'updated label',
              });
          });
     })
  });

  describe('DELETE /labels/:id', () => {
    describe('200', () => {
        it('should delete label', async () => {
          const label = await connection
          .getRepository(Label)
          .save({ name: 'delete me...' });

            const response = await makeRequest(app).delete(`/labels/${label.id}`);

            expect(response.status).toBe(HttpStatus.OK);

            // check if deleted label is still in database
            const found = await connection
            .getRepository(Label)
            .findOne(label.id);
            expect(found).toBe(undefined);
        });
      })

      describe('404', () => {
        it('should handle not-found exception', async () => {
          const label = await connection
          .getRepository(Label)
          .save({ name: 'things' });
          await connection.getRepository(Label).delete(label.id)

          const response = await makeRequest(app).delete(`/labels/${label.id}`);

          expect(response.status).toBe(HttpStatus.NOT_FOUND);
          expect(response.body).toEqual({
            error: 'Not Found',
            statusCode: 404,
            message: `Label with ID \"${label.id}\" not found`
          })
        });
      })
    });
});
