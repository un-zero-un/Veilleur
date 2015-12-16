<?php

use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\Debug\Debug;
use Symfony\Component\HttpFoundation\Request;

$config = ['env' => 'prod', 'debug' => false];
if (is_file(__DIR__.'/../env.php')) {
    $config = require __DIR__ . '/../env.php';
}

if ($config['debug']) {
    $loader = require __DIR__.'/../app/autoload.php';
    Debug::enable();
} else {
    $loader = require_once __DIR__.'/../app/bootstrap.php.cache';
}

require_once __DIR__.'/../app/AppKernel.php';
//require_once __DIR__.'/../app/AppCache.php';

$kernel = new AppKernel($config['env'], $config['debug']);
$kernel->loadClassCache();
//$kernel = new AppCache($kernel);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
