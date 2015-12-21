<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
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
    /**
     * @ORM\ManyToMany(targetEntity="Tag", inversedBy="watchLinks")
     * @ORM\JoinTable(name="watch_link_tag",
     *     joinColumns={@ORM\JoinColumn(name="watch_link_id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="tag_id")}
     * )
     *
     * @var ArrayCollection<Tag>
     */
    private $tags;

    public function __construct()
    {
        $this->setCreatedAt(new \DateTime());
        $this->tags = new ArrayCollection();
    }

    /**
     * @return Tag[]
     */
    public function getTags()
    {
        return $this->tags;
    }

    public function addTag(Tag $tag)
    {
        $this->tags[] = $tag;
    }
}
