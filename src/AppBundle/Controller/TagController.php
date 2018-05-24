<?php
namespace AppBundle\Controller;

use AppBundle\Entity\Tag;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @author Nathan JANCZEWSKI
 */
class TagController extends Controller
{

    /**
     * @Route(name="link_tags",
     *        path="/tags/link/{mainTag}/{secondaryTag}",
     *        methods={"POST"},
     *        defaults={
     *          "_api_resource_class"=Tag::class,
     *        }
     *     )
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

        if ($wasAdded) {
            $em->persist($tag);
            $em->flush();

            $nrm = $ser->normalize($tag, 'jsonld');

            return new Response(json_encode($nrm), Response::HTTP_CREATED);
        } else {
            return new Response('', Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * @Route(name="unlink_tags",
     *        path="/tags/link/{child}",
     *        methods={"DELETE"},
     *        defaults={
     *          "_api_resource_class"=Tag::class,
     *        }
     *     )
     *
     * @param $child Tag The tag you want to un-child from another one
     *
     * @return Response
     */
    public function unlinkTags($child)
    {
        $rp = $this->getDoctrine()->getRepository(Tag::class);
        $em = $this->getDoctrine()->getManager();

        $tag = $rp->findOneBy(['name' => $child]);

        if (null === $tag) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        $em->persist($tag);
        $em->flush();

        return new Response('', Response::HTTP_NO_CONTENT);
    }

}