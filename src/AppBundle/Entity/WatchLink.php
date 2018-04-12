<?php

namespace AppBundle\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use AppBundle\Filter\OverriddenFilter;
use AppBundle\Filter\SearchFilter;
use AppBundle\Filter\TagFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Repository\WatchLinkRepository")
 * @ORM\Table(name="watch_link", indexes={
 *     @ORM\Index(name="url_idx", columns={"url"}),
 *     @ORM\Index(name="created_at_idx", columns={"created_at"})
 * })
 *
 * @author Yohan Giarelli <yohan@giarel.li>
 * @ApiResource(
 *    collectionOperations={"get", "special"={ "route_name"="watchlink_discover"} },
 *    itemOperations={"get"},
 *    attributes={
 *        "normalization_context"={"groups"={"WatchLink"}},
 *        "denormalization_context"={"groups"={"WatchLink"}},
 *        "order"={"createdAt": "DESC"}
 *    },
 * )
 * @ApiFilter(OrderFilter::class, properties={"createdAt"}, arguments={"orderParameterName"="order"})
 * @ApiFilter(TagFilter::class)
 * @ApiFilter(OverriddenFilter::class)
 * @ApiFilter(SearchFilter::class)
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
     * @Groups({"WatchLink"})
     *
     * @var ArrayCollection<Tag>
     */
    private $tags;

    /**
     * @ORM\Column(type="boolean", nullable=false, options={"default": FALSE})
     *
     * @var bool
     */
    private $overridden;

    public function __construct()
    {
        $this->setCreatedAt(new \DateTime());
        $this->tags       = new ArrayCollection();
        $this->overridden = false;
    }

    /**
     * @return ArrayCollection<Tag>
     */
    public function getTags()
    {
        return $this->tags;
    }

    public function addTag(Tag $tag)
    {
        $this->tags[] = $tag;
    }

    /**
     * @return bool
     */
    public function isOverridden()
    {
        return $this->overridden;
    }
}
