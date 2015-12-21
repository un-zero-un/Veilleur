<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\TagRepository")
 * @ORM\Table(name="tag", indexes={@ORM\Index(name="name_idx", columns={"name"})})
 *
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class Tag
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string", unique=true)
     *
     * @var string
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\WatchLink", mappedBy="tags")
     *
     * @var WatchLink[]
     */
    private $watchLinks;

    public function __construct($name)
    {
        $this->name = $name;
        $this->watchLinks = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return WatchLink[]
     */
    public function getWatchLinks()
    {
        return $this->watchLinks;
    }
}
