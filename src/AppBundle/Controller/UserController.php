<?php
namespace AppBundle\Controller;

use AppBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserController
{

    /** @var EntityManagerInterface */
    private $em;

    public function __construct(EntityManagerInterface $emi)
    {
        $this->em = $emi;
    }

    public function __invoke(User $user, $val): User
    {
        if (filter_var($val, FILTER_VALIDATE_BOOLEAN)) {
            $user->addRole('ROLE_ADMIN');
        } else {
            $user->removeRole('ROLE_ADMIN');
        }

        return $user;
    }
}

