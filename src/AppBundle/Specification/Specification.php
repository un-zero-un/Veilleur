<?php

namespace AppBundle\Specification;


interface Specification
{
    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isSatisfiedBy($data);
}
