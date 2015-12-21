<?php

namespace AppBundle\Controller;

use Dunglas\ApiBundle\Controller\ResourceController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Url;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class WatchLinkController extends ResourceController
{
    /**
     * @param Request $request
     *
     * @return \Dunglas\ApiBundle\JsonLd\Response
     */
    public function discoverAction(Request $request)
    {
        $resource   = $this->getResource($request);
        $object     = $this->get('serializer')->deserialize(
            $request->getContent(),
            $resource->getEntityClass(),
            'json-ld',
            $resource->getDenormalizationContext()
        );
        $violations = $this->get('validator')->validate($object);
        if (0 === count($violations)) {
            $object = $this->get('extractor.watch_link_metadata')->extract($object->getUrl(), []);
            $this->getDoctrine()->getManager()->persist($object);
            $this->getDoctrine()->getManager()->flush();

            return $this->getSuccessResponse($resource, $object, 201);
        }

        return $this->getErrorResponse($violations);
    }
}
