<?php
namespace AppBundle\Controller;

use AppBundle\Entity\Tag;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @author Nathan JANCZEWSKI
 */
class TagController extends Controller
{

    /**
     * @Route("/tags/link/{mainTag}/{secondaryTag}")
     * @Method({ "POST" })
     *
     * @param $mainTag       Tag    Main tag, the only one shown
     * @param $secondaryTag  Tag    Secondary tag, alias of the main one
     *
     * @return Response
     */
    public function linkTags($mainTag, $secondaryTag) {

        $rp = $this->getDoctrine()->getRepository(Tag::class);
        $em = $this->getDoctrine()->getManager();

        $ser = $this->get('serializer');
        $tag = $rp->findOneBy(['name' => $mainTag]);
        $sec = $rp->findOneBy(['name' => $secondaryTag]);

        if (null === $tag || null === $sec) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        $wasAdded = $tag->addDuplicate($sec);

        if ($wasAdded === Response::HTTP_CREATED) {
            $em->persist($tag);
            $em->flush();

            $nrm = $ser->normalize($tag, 'jsonld');

            return new Response(json_encode($nrm), $wasAdded);
        } else {
            return new Response('', $wasAdded);
        }
    }



}