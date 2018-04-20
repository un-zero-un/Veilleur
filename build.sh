#!/bin/sh

docker-compose -f docker-compose.prod.yml build php
docker-compose -f docker-compose.prod.yml build nginx
docker-compose -f docker-compose.prod.yml build veilleur
