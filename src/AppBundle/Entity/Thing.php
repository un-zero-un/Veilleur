<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * The most generic type of item.
 *
 * @see http://schema.org/Thing Documentation on Schema.org
 *
 * @ORM\MappedSuperclass
 */
abstract class Thing
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    /**
     * @var string A short description of the item.
     *
     * @Groups({"WatchLink"})
     * @ORM\Column(nullable=true)
     * @Assert\Type(type="string")
     */
    private $description;
    /**
     * @var string An image of the item. This can be a [URL](http://schema.org/URL) or a fully described [ImageObject](http://schema.org/ImageObject).
     *
     * @Groups({"WatchLink"})
     * @ORM\Column(nullable=true, length=1024)
     * @Assert\Url
     */
    private $image;
    /**
     * @var string The name of the item.
     *
     * @Groups({"WatchLink"})
     * @ORM\Column(nullable=true)
     * @Assert\Type(type="string")
     */
    private $name;
    /**
     * @var string URL of the item.
     *
     * @Groups({"WatchLink"})
     * @ORM\Column(length=1024)
     * @Assert\Url
     * @Assert\NotBlank
     */
    private $url;
    /**
     * @var \DateTime
     *
     * @Groups({"WatchLink"})
     * @ORM\Column(type="datetime", name="created_at")
     * @Assert\DateTime
     * @Assert\NotNull
     */
    private $createdAt;

    /**
     * Sets id.
     *
     * @param int $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Gets id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Sets description.
     *
     * @param string $description
     *
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Gets description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Sets image.
     *
     * @param string $image
     *
     * @return $this
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Gets image.
     *
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Sets name.
     *
     * @param string $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Gets name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets url.
     *
     * @param string $url
     *
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Gets url.
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Sets createdAt.
     *
     * @param \DateTime $createdAt
     *
     * @return $this
     */
    public function setCreatedAt(\DateTime $createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Gets createdAt.
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
}
