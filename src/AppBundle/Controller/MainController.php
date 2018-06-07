<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MainController extends Controller {

    public function app() {
        $arr = [
            "google_client_id" => $this->getParameter('google_client_id')
        ];
        return $this->render('react_app.html.twig', $arr);
    }

    public function login() {
        $arr = [
            "google_client_id" => $this->getParameter('google_client_id')
        ];
        return $this->render('react_app.html.twig', $arr);
    }

}