Veilleur
========

[![Build Status](https://travis-ci.org/un-zero-un/Veilleur.svg?branch=master)](https://travis-ci.org/un-zero-un/Veilleur)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/un-zero-un/Veilleur/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/un-zero-un/Veilleur/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/un-zero-un/Veilleur/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/un-zero-un/Veilleur/?branch=master)
[![SensioLabsInsight](https://insight.sensiolabs.com/projects/510aa993-8056-46af-b24e-40eb0ec4c209/mini.png)](https://insight.sensiolabs.com/projects/510aa993-8056-46af-b24e-40eb0ec4c209)

Veilleur is a simple api-based technology monitoring app that we use at Un zéro un.

It listens for Slack messages in a given channel, and when it contains an URL, it extract it with some tags.

Veilleur uses PHP7.0 and Symfony 3.0.

Import slack messages
---------------------

```bash
 $ php bin/console veilleur:slack:import
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
