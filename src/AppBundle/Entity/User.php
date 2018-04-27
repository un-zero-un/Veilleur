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

    public function getID() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }

    public function setUsername(string $username)
    {
        $this->username = $username;
        return $this;
    }

    public function setEmail(string $email) {
        $this->email = $email;
        return $this;
    }

    public function getRoles() {
        if (preg_match_all("#^([a-z]|[A-Z]|[0-9])+\@un\-zero\-un\.fr$#", $this->getEmail()))
            return [ "ROLE_ADMIN" ];
        else
            return [ "ROLE_USER" ];
    }

    public function getPassword() { return null; }

    public function getSalt() { return null; }

    public function eraseCredentials() { }
}