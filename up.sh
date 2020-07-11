#!/bin/bash
source ./env.sh

docker network create --subnet 10.1.1.0/16 --gateway=10.1.1.1 --ip-range 10.1.1.0/24 --driver=bridge app
docker-compose -f docker-compose.yml up -d

read -p "Press any key..."