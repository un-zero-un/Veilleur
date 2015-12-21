<?php

namespace AppBundle\Specification;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsOriginalMessage implements Specification
{
    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isSatisfiedBy($data)
    {
        return !isset($data->subtype);
    }
}
