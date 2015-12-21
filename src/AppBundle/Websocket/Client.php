<?php

namespace AppBundle\Websocket;

use WebSocket\Client as BaseClient;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class Client extends BaseClient
{
    /**
     * @return string
     *
     * @throws \WebSocket\ConnectionException
     */
    protected function receive_fragment()
    {
        $returnValue = parent::receive_fragment();

        if ($this->getLastOpcode() === 'ping') {
            $this->send('pong', 'pong', true);
        }

        return $returnValue;
    }
}
