run:
	docker-compose up -d
	yarn run encore dev --watch

veilleur:
	docker-compose exec php php bin/console veilleur:slack:receive

reset:
	docker-compose exec php ./reset.sh
