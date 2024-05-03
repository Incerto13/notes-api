#!/bin/sh

# Before PostgreSQL can function correctly, the database cluster must be initialized:
# initdb -D /var/lib/postgres/data


#start postgres server
/usr/bin/postgres -D /var/lib/postgres/data &

# create a user or role
# psql -d postgres -c "CREATE USER someuser WITH PASSWORD 'jkhkjah';" 

# create database 
psql -d postgres -c "CREATE DATABASE notes OWNER 'postgres';"
echo "Successfullly created 'notes' database"