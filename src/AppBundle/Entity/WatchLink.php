<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="watch_link")
 *
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class WatchLink extends Thing
{
    public function __construct()
    {
        $this->setCreatedAt(new \DateTime());
    }
}
