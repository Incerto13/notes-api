start-db:
	docker-compose -f docker-compose.yml up --build -d

stop-db:
	docker stop notes-db pgadmin4

start-test-db:
	docker-compose -f docker-compose.test-int.yml up -d

stop-test-db:
	docker stop notes-db_test-int pgadmin4_test-int