#!/bin/bash

# Start docker if not already started
sudo systemctl start docker

# Start Cassandra via docker
sudo docker compose -f /home/compjeuter/Other/Projects/CassandraCaseStudy/docker-compose.yaml -p cassandra-case-study up -d

CASSANDRA_CONTAINER_NAME='cassandra-db'

# Wait for Cassandra to start
while ! (docker exec $CASSANDRA_CONTAINER_NAME nodetool status >/dev/null 2>&1); do
  echo 'Waiting for Cassandra to start...';
  sleep 5;
done

echo 'Cassandra is ready!';