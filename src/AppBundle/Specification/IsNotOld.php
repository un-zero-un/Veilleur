<?php

namespace AppBundle\Specification;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsNotOld implements Specification
{
    /**
     * @var \DateTime
     */
    private $date;

    public function __construct(\DateTime $date)
    {
        $this->date = $date;
    }

    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isSatisfiedBy($data)
    {
        return isset($data->ts) && $this->date < \DateTime::createFromFormat('U.u', $data->ts);
    }
}
