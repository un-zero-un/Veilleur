<?php

namespace AppBundle\Fetcher;

use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\GuzzleException;

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
     * @throws GuzzleException
     * @return string
     */
    public function fetch(string $url, array $headers = []): string
    {
        return $this->guzzle->request('GET', $url, [ 'header' => $headers ])->getBody()->getContents();
    }

}
