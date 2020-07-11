#!/bin/sh
export COMPOSE_PROJECT_NAME=frozezeon_test

export DB_HOST=10.1.1.3
export DB_USER=root
export DB_PASSWORD=root
export DB_NAME=app_test
export CI_ENV=development
export CI_APP_DIR=//var//www//html//application
export NGINX_SERVER_NAME=127.0.0.1