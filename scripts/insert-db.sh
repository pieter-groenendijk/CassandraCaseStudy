#!/bin/bash

CONTAINER_NAME='cassandra-db'

# Run cassandra
sh ./run-db.sh

node ../src/migrate-app/index.js
