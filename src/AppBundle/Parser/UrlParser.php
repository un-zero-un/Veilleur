<?php

namespace AppBundle\Parser;

class UrlParser
{

    public function getAbsolutePath(string $urlRoot, string $path)
    {
        // Si // => http+ url (juste pour tester)
        $url     = $path;
        $testUrl = $path;
        if (substr($url, 0, 2) === '//') {
            $testUrl = "http:$url";
        }

        // Si / => rel (ajouter path)
        if (substr($testUrl, 0, 1) === "/") {
            $urlRoot = parse_url($urlRoot, PHP_URL_SCHEME) . '://' . parse_url($urlRoot, PHP_URL_HOST);
            $url     = $urlRoot . $path;
            $testUrl = $url;
        }

        // Valider url
        if (filter_var($testUrl, FILTER_VALIDATE_URL)) {
            return $url;
        }

        return null;
    }

}
