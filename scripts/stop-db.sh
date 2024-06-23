#!/bin/bash

sudo docker compose -f ./docker-compose.yaml -p cassandra-case-study down --remove-orphans
