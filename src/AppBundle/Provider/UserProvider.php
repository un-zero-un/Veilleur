<?php

namespace AppBundle\Provider;

use AppBundle\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthAwareUserProviderInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\EntityUserProvider;
use AppBundle\Security\AdminValidator;

class UserProvider extends EntityUserProvider implements OAuthAwareUserProviderInterface
{

    /**
     * @var AdminValidator
     */
    private $adminValidator;

    public function __construct(ManagerRegistry $registry, AdminValidator $admin, array $properties = [], $managerName = null)
    {
        $this->adminValidator = $admin;
        parent::__construct($registry, User::class, $properties, $managerName);
    }

    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        $user = $this->findUser(['email' => $response->getEmail()]);

        if (null === $user) {
            $user = $this->createUser($response);

            if ($this->adminValidator->isAdmin($user)) {
                $user->addRole('ROLE_ADMIN');
            } else {
                $user->addRole('ROLE_USER');
            }

            $this->updateUser($user);
        }


        return $user;
    }

    public function createUser(UserResponseInterface $uri) : User
    {
        return (new User())->setUsername($uri->getEmail())->setEmail($uri->getEmail());
    }

    public function updateUser($user)
    {
        $this->em->persist($user);
        $this->em->flush();
    }
}