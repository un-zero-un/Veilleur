<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use AppBundle\Entity\WatchLink;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;


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
     */
    public function __invoke(Request $rq)
    {
        $class = WatchLink::class;
        $ctx   = ["groups" => ["WatchLink"]];


        /** @var Serializer $ser */
        $ser = $this->get('serializer');

        /** @var WatchLink $object */
        $object = $ser->deserialize(
            $rq->getContent(),
            $class,
            'jsonld',
            $ctx
        );

        $violations = $this->get('validator')->validate($object);

        if (0 === count($violations)) {
            $object = $this->get('extractor.watch_link_metadata')->extract($object->getUrl(), []);
            $this->getDoctrine()->getManager()->persist($object);
            $this->getDoctrine()->getManager()->flush();

            $nrm = $ser->normalize($object, 'jsonld', $ctx);

            return new Response(json_encode($nrm), 201);
        }
        return new Response(json_encode($ser->normalize($violations, 'hydra-error')), 400);
    }
}
