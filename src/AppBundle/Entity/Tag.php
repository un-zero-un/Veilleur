<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;


/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\TagRepository")
 * @ORM\Table(name="tag", indexes={@ORM\Index(name="name_idx", columns={"name"})})
 *
 * @author Yohan Giarelli <yohan@giarel.li>
 * @ApiResource(
 * 	collectionOperations={"get"},
 * 	itemOperations={"get"}
 * )
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
     * @Groups({"WatchLink"})
     *
     * @var string
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\WatchLink", mappedBy="tags")
     *
     * @var ArrayCollection<WatchLink>
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
