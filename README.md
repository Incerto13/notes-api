## Solace Notes Api

Tech stack: Nest.js, Typescript, TypeORM, Postgres, Supertest 

## Installation

```bash
$ yarn
```

## Running the app

- copy the contents of the `.env.example` file and put in into a `.env` file in the root directory

```bash
# stop your local postgresql service (for example if you installed via homebrew)
$ brew services list 
$ brew services stop postgresql@14 

# start the dev database in docker
$ make up-db

# development
$ npm run start:dev
```

- The api will be running on http://localhost:3000
- pgAdmin running in docker can be accessed on http://localhost:8888 
  - pgAdmin in docker: username: `postgres@solace.com` and password: `postgres` 
  - to view the database add a server with a hostname/address (under the connection tab) of `localhost` and same credentials as above
  - alternatively if you already have pgAdmin running on your local machine can connect via the same `localhost` hostname/address

## Test
```bash
# unit tests
$ yarn run test:unit

# integration tests
$ make down-db # first stop and remove dev container and volumes
$ make up-test-db # stand up integration-test db
$ yarn run test:int
$ make down-test-db # before going back to development must remove test-db and volumes

# all tests (note: test-db must be running)
$ npm run test:all

# test coverage (note: test-db must be running)
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
