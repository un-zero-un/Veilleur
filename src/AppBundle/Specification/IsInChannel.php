<?php

namespace AppBundle\Specification;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsInChannel implements Specification
{
    /**
     * @var string
     */
    private $channel;

    public function __construct($channel)
    {
        $this->channel = $channel;
    }

    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isSatisfiedBy($data)
    {
        return isset($data->channel) && $data->channel === $this->channel;
    }
}
