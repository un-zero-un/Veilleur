<?php
namespace AppBundle\Security;

use AppBundle\Entity\User;

class AdminValidator {

    /**
     * Contains each domain for which registred user will be automatically administrator
     * @var string[]
     */
    private $allowedDomains;

    public function __construct(array $allowedDomains) {
        $this->allowedDomains = $allowedDomains;
    }

    /**
     * Returns whether the user is an admin or not according to its email's domain name
     * @param User $user
     * @return bool
     */
    public function isAdmin(User $user) {
        $domain = explode('@', trim($user->getEmail()));
        return in_array($domain[1], array_values($this->allowedDomains), true);
    }

}