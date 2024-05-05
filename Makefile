up-db:
	docker-compose -f docker-compose.yml up --build -d

down-db:
	docker stop notes-db pgadmin4
	docker rm --volumes notes-db pgadmin4 

up-test-db:
	docker-compose -f docker-compose.test-int.yml up -d

down-test-db:
	docker stop notes-db_test-int pgadmin4_test-int
	docker rm --volumes notes-db_test-int pgadmin4_test-int