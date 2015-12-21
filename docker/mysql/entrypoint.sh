#!/usr/bin/env bash
set -e

if [ -z "$(ls -A /data/mysql)" -a "${1%_safe}" = 'mysqld' ]; then
	if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
		echo >&2 'error: database is uninitialized and MYSQL_ROOT_PASSWORD not set'
		echo >&2 '  Did you forget to add -e MYSQL_ROOT_PASSWORD=... ?'
		exit 1
	fi

	mysql_install_db --datadir=/data/mysql
	chown -R mysql:mysql /data/mysql

	# These statements _must_ be on individual lines, and _must_ end with
	# semicolons (no line breaks or comments are permitted).
	cat > /tmp/mysql-first-time.sql <<-EOSQL
		UPDATE mysql.user SET host = "172.17.%", password = PASSWORD("${MYSQL_ROOT_PASSWORD}") WHERE user = "root" LIMIT 1 ;
		DELETE FROM mysql.user WHERE user != "root" OR host != "%" ;
		DROP DATABASE IF EXISTS test ;
		CREATE DATABASE veilleur ;
		GRANT ALL PRIVILEGES ON veilleur.* to veilleur@"%" IDENTIFIED BY 'veilleur';
		FLUSH PRIVILEGES ;
	EOSQL

	exec "$@" --init-file=/tmp/mysql-first-time.sql
fi

exec "$@"
