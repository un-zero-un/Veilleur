<?php

namespace AppBundle\Specification;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsSlackMessage implements Specification
{
    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isSatisfiedBy($data)
    {
        if (!$data instanceof \stdClass) {
            return false;
        }

        if (!isset($data->type)) {
            return false;
        }

        if ('message' !== $data->type) {
            return false;
        }

        return true;
    }
}
