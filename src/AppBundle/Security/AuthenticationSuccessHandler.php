<?php

namespace AppBundle\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Resources\JsResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    /** @var EventDispatcherInterface $dispatcher */
    private $dispatcher;

    /** @var JWTManager $jwtManager */
    private $jwtManager;

    public function __construct(JWTManager $jwt, EventDispatcherInterface $dispatcher)
    {
        $this->jwtManager = $jwt;
        $this->dispatcher = $dispatcher;
    }


    /**
     * This is called when an interactive authentication attempt succeeds. This
     * is called by authentication listeners inheriting from
     * AbstractAuthenticationListener.
     *
     * @return Response never null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        return $this->handleAuthenticationSuccess($token->getUser());
    }

    public function handleAuthenticationSuccess(UserInterface $user, $jwt = null)
    {
        if (null === $jwt) {
            $jwt = $this->jwtManager->create($user);
        }

        /** @var JsResponse $response */
        $response = new JsResponse();

        /** @var AuthenticationSuccessEvent $event */
        $event = new AuthenticationSuccessEvent(['token' => $jwt], $user, $response);
        $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $event);

        $refreshToken = $event->getData()[ 'refresh_token' ] ?? '';

        $storeToken = <<<JS
function storageAvailable(type) {
	try {
		let storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

if (storageAvailable('localStorage')) {
    localStorage['token'] = '$jwt';
    localStorage['refresh_token'] = '$refreshToken';
}

window.location = "/";
JS;
        return $response->setJS($storeToken);
    }
}