<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="veilleur_user")
 */
class User implements UserInterface
{

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $username;

    /**
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $email;

    /**
     * @ORM\Column(type="array")
     */
    private $roles;

    public function __construct() {
       $this->roles = [];
    }

    public function getID() { return $this->id; }

    public function getUsername() { return $this->username; }

    public function getEmail() { return $this->email; }

    public function setUsername(string $username)
    {
        $this->username = $username;
        return $this;
    }

    public function setEmail(string $email)
    {
        $this->email = $email;
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
     * @return User
     */
    public function addRole(string $role): User
    {
        if (!in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
        }
        return $this;
    }

    /**
     * @return null
     */
    public function getPassword() { return null; }

    /**
     * @return null
     */
    public function getSalt() { return null; }

    public function eraseCredentials() { }

}