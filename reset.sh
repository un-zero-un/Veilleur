#!/usr/bin/env sh

php bin/console doctrine:schema:drop --force $*
php bin/console doctrine:schema:create $*
php bin/console veilleur:slack:import $*
