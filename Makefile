run:
	docker-compose up -d

dev: run assets

veilleur:
	docker-compose exec php php bin/console veilleur:slack:receive

import:
	docker-compose exec php php bin/console veilleur:slack:import

assets:
	docker-compose exec nginx yarn run encore dev --watch

assets_prod:
	docker-compose exec nginx yarn run encore production

reset:
	docker-compose exec php ./reset.sh
