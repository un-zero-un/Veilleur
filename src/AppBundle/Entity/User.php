<?php

namespace AppBundle\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity()
 * @ORM\Table(name="veilleur_user")
 * @ApiResource(
 *    collectionOperations={ "get" },
 *    itemOperations={"get", "delete", "toggleAdmin"={
 *              "method"="PUT",
 *              "path"="/users/{id}/admin/{val}",
 *              "controller"=AppBundle\Controller\UserController::class
 *      }
 *     },
 *     attributes={
 *         "normalization_context"={"groups"={"users"}},
 *         "denormalization_context"={"groups"={"users"}},
 *         "pagination_enabled"=false
 *     }
 * )
 */
class User implements UserInterface
{

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({ "users" })
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string", nullable=false)
     * @Groups({ "users" })
     *
     * @var string
     */
    private $username;

    /**
     * @ORM\Column(type="array")
     * @Groups({ "users" })
     */
    private $roles;

    public function __construct()
    {
        $this->roles = [];
    }

    public function getId()
    {
        return $this->id;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername(string $username)
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return string[]
     */
    public function getRoles(): ?array
    {
        return $this->roles;
    }

    /**
     * @param string $role
     *
     * @return User
     */
    public function addRole(string $role): User
    {
        if (!in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
        }
        return $this;
    }

    public function removeRole(string $role): User
    {
        var_dump('Removing ' .$role);
        if (in_array($role, $this->roles, true)) {
            var_dump('In array');
            $index = array_search($role, $this->roles);
            var_dump('At index ' . $index);
            array_splice($this->roles, $index, 1);
        }
        var_dump("Done");
        return $this;
    }

    /**
     * @return null
     */
    public function getPassword()
    {
        return null;
    }

    /**
     * @return null
     */
    public function getSalt()
    {
        return null;
    }

    public function eraseCredentials()
    {
    }

}