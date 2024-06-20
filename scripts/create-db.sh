#!/bin/bash

CONTAINER_NAME='cassandra-db'

# Run cassandra
sh ./run-cassandra.sh

# Path to ddl script
SCRIPT_FILE='../src/cql/spotify-playlists/ddl.cql'
SCRIPT_CONTENT=$(<"$SCRIPT_FILE");

# Run it against cqlsh via docker
docker exec -i $CONTAINER_NAME cqlsh -e "$SCRIPT_CONTENT"