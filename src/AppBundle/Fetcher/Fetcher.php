<?php

namespace AppBundle\Fetcher;


interface Fetcher
{
    /**
     * @param string $url
     *
     * @return string
     */
    public function fetch(string $url): string;
}
