<?php


namespace AppBundle\Api;

use GuzzleHttp\ClientInterface;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class SlackApi
{
    /**
     * @var ClientInterface
     */
    private $guzzle;

    /**
     * @var string
     */
    private $token;

    public function __construct(ClientInterface $guzzle, $token)
    {
        $this->guzzle = $guzzle;
        $this->token  = $token;
    }

    /**
     * @param string $method
     * @param array  $args
     *
     * @return string
     */
    public function request($method, array $args = [])
    {
        $url = sprintf(
            'https://slack.com/api/%s?%s',
            $method,
            http_build_query(array_merge(['token' => $this->token], $args))
        );

        return $this->guzzle->request('GET', $url)->getBody()->getContents();
    }

    /**
     * @param string $name
     *
     * @return string
     */
    public function findChannelId($name)
    {
        $response = $this->request('channels.list');

        foreach (json_decode($response)->channels as $channel) {
            if ($channel->name === $name) {
                return $channel->id;
            }
        }

        throw new \RuntimeException('No channel found');
    }
}
