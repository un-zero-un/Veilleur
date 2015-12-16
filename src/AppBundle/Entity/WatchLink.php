<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="watch_link", indexes={
 *     @ORM\Index(name="url_idx", columns={"url"}),
 *     @ORM\Index(name="created_at_idx", columns={"created_at"})
 * })
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
