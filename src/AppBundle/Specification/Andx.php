<?php

namespace AppBundle\Specification;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class Andx implements Specification
{
    /**
     * @var Specification[]
     */
    private $specs;

    public function __construct(Specification ...$specs)
    {
        $this->specs = $specs;
    }

    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isSatisfiedBy($data)
    {
        foreach ($this->specs as $spec) {
            if (!$spec->isSatisfiedBy($data)) {
                return false;
            }
        }

        return true;
    }
}
