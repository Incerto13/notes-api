# For running db and api in container in prod
up-prod:
	sudo docker-compose -f docker-compose.yml --env-file .env.prod up --build -d
	
down-prod:
	sudo docker stop notes-db pgadmin4 api
	sudo docker rm --volumes notes-db pgadmin4 api


# For running db in container (while running api on local machine)
up-dev-db:
	docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d

down-dev-db:
	docker stop notes-db pgadmin4
	docker rm --volumes notes-db pgadmin4 


# For running integration tests on local machine or github workflow
up-test-db:
	docker-compose -f docker-compose.test-int.yml --env-file .env.test up -d

down-test-db:
	docker stop notes-db_test-int pgadmin4_test-int
	docker rm --volumes notes-db_test-int pgadmin4_test-int