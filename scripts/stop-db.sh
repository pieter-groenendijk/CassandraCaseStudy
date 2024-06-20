#!/bin/bash

sudo docker compose -f /home/compjeuter/Other/Projects/CassandraCaseStudy/docker-compose.yaml -p cassandra-case-study down --remove-orphans
