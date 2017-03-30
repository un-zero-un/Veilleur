<?php

namespace AppBundle\Filter;

use AppBundle\Entity\WatchLink;
use Doctrine\ORM\QueryBuilder;
use Dunglas\ApiBundle\Api\ResourceInterface;
use Dunglas\ApiBundle\Doctrine\Orm\Filter\AbstractFilter;
use Symfony\Component\HttpFoundation\Request;

/**
 * @author Yohan Giarelli <yohan@un-zero-un.fr>
 */
class OverriddenFilter extends AbstractFilter
{
    public function apply(ResourceInterface $resource, QueryBuilder $queryBuilder, Request $request)
    {
        if ($resource->getEntityClass() !== WatchLink::class) {
            return;
        }

        $queryBuilder->andWhere($queryBuilder->getRootAliases()[0].'.overridden = FALSE');
    }

    public function getDescription(ResourceInterface $resource)
    {
        return [];
    }
}
