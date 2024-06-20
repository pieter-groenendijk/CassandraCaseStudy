#!/bin/bash

CONTAINER_NAME='cassandra-db'

# Run cassandra
sh ./run-cassandra.sh

node ../src/migrate-app/index.js
