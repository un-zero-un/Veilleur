Veilleur
========
Veilleur is a simple api-based technology monitoring app that we use at Un zéro un.

It listens for Slack messages in a given channel, and when it contains an URL, it extract it with some tags.

Veilleur uses Docker, PHP7.2 and Symfony 3.4.

Setup
-----
First, clone this repository and make sure you have Docker and Docker-compose installed.

Go to the [Google developper console](http://console.developers.google.com/) and create a new OAuth app.

You should allow the redirect urls to be 'http://HOSTNAME/login/check-google' and 'http://HOSTNAME/token'.



Then, move into the folder and copy the environment file
```bash
$ cd Veilleur
$ cp env.dist env.prod
```

Edit this file and fill out the blanks:

* SLACK_WEB_API_TOKEN: Generate a [Slack legacy token](https://api.slack.com/custom-integrations/legacy-tokens) and write it there
* SLACK_WEB_CHANNEL: Channel that need to be monitored
* PASSPHRASE_KEY: Some passphrase you will use to generate the private key
* TOKEN_TTL: Time before which the token has to be renewed
* ADMIN_DOMAINS: JSON containing the domains that will automatically be admins
* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET

You'll then need to generate RSA keys. It will ask for the passphrase you set in the env file 3 times
```bash
$ make genkeys
```

Building the app
```bash
$ make build
```

Now that the app is built, we'll generate our database. 
Doing so, we'll need to run the project once
```bash
$ docker-compose -f docker-compose.prod.yml up php database -d
$ make gendb
```

Now that everything is ready, let's start the app
```bash
$ docker-compose -f docker-compose.prod.yml up -d
```

Import slack messages
---------------------

```bash
 $ make import
```

Listen for slack messages
-------------------------

```bash
 $ php bin/console veilleur:slack:receive
```


Contributing
------------

This project will eventually accept contribution, but it is a simple side-project built for personal use. I won't 
be actively maintaining it. That's said.
