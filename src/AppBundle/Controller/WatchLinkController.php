<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Repository\TagRepository;
use AppBundle\Entity\Tag;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use AppBundle\Entity\WatchLink;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;


/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class WatchLinkController extends Controller
{

    /**
     * @Route(
     *     name="watchlink_discover",
     *     path="/watch_links/discover",
     *     methods={"POST"},
     *     defaults={
     *          "_api_resource_class"=WatchLink::class,
     *          "_api_collection_operation_name"="discover"
     *     }
     * )
     * @param Request $rq
     * @return Response
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function __invoke(Request $rq)
    {
        $class = WatchLink::class;
        $ctx = ["groups" => ["WatchLink"]];


        /** @var Serializer $ser */
        $ser = $this->get('serializer');

        /** @var WatchLink $object */
        $object = $ser->deserialize(
            $rq->getContent(),
            $class,
            'jsonld',
            $ctx
        );

        $tags = json_decode($rq->getContent(), true);
        if (array_key_exists('taglist', $tags))
            $tags = $tags['taglist'];
        else
            $tags = [];

        $violations = $this->get('validator')->validate($object);

        if (0 === count($violations)) {
            $object = $this->get('extractor.watch_link_metadata')->extract($object->getUrl(), $tags);
            $this->getDoctrine()->getManager()->persist($object);
            $this->getDoctrine()->getManager()->flush();

            $nrm = $ser->normalize($object, 'jsonld', $ctx);

            return new Response(json_encode($nrm), 201);
        }
        return new Response(json_encode($ser->normalize($violations, 'hydra-error')), 400);
    }

    private function TMP_dumpLink(WatchLink $link)
    {
        var_dump("----------------------------");
        var_dump($link->getName());
        var_dump($link->getDescription());
        var_dump($link->getId());
        var_dump($link->getUrl());
        var_dump($link->getImage());
        /** @var Tag $tag */
        foreach ($link->getTags() as $tag) {
            echo "\t\t" . $tag->getName() . "\n";
        }
        var_dump("----------------------------");
    }

    /**
     * @Route(
     *     name="watchlink_update",
     *     path="/watch_links/{id}",
     *     methods={"PUT"},
     * )
     * @param string $id
     * @param Request $rq
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function update(string $id, Request $rq)
    {
        $emi = $this->getDoctrine()->getManager();

        // @TODO: Use Symfony serializer
        $json = json_decode($rq->getContent(), true);

        $link = $emi->getRepository(WatchLink::class)->findOneBy(["id" => $id]);

        $link->setName($json['name']);
        $link->setDescription($json['description']);
        $link->setUrl($json['url']);

        /** @var TagRepository $trp */
        $trp = $this->getDoctrine()->getRepository(Tag::class);

        $link->clearTags();
        foreach ($json['tags'] as $tag) {
            $link->addTag($trp->findOrCreate($tag));
        }

        $emi->persist($link);
        $emi->flush();

        // @TODO: get autowire working on route
        /** @var SerializerInterface $srz */
        $srz = $this->get('serializer');
        return new JsonResponse($srz->serialize($link, 'jsonld'));
    }
}
