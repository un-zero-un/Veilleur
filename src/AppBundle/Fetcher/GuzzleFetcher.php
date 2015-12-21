<?php

namespace AppBundle\Fetcher;

use GuzzleHttp\ClientInterface;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class GuzzleFetcher implements Fetcher
{
    /**
     * @var ClientInterface
     */
    private $guzzle;

    public function __construct(ClientInterface $guzzle)
    {
        $this->guzzle = $guzzle;
    }

    /**
     * @param string $url
     *
     * @return string
     */
    public function fetch(string $url): string
    {
        return $this->guzzle->request('GET', $url)->getBody()->getContents();
    }
}
