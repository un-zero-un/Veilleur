<?php

namespace AppBundle\Filter;

use Doctrine\ORM\QueryBuilder;
use Dunglas\ApiBundle\Api\ResourceInterface;
use Dunglas\ApiBundle\Doctrine\Orm\Filter\AbstractFilter;
use Symfony\Component\HttpFoundation\Request;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class TagFilter extends AbstractFilter
{
    /**
     * {@inheritdoc}
     */
    public function apply(ResourceInterface $resource, QueryBuilder $queryBuilder, Request $request)
    {
        if (!$request->query->has('tags')) {
            return;
        }

        foreach ($request->query->get('tags') as $i => $tag) {
            $queryBuilder
                ->innerJoin($queryBuilder->getRootAliases()[0] . '.tags', 't'.$i)
                ->andWhere('t'.$i.'.name = :name_' . $i)
                ->setParameter('name_' . $i, $tag);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getDescription(ResourceInterface $resource)
    {
        return [
            'tags[]' => [
                'property' => 'tags[]',
                'type'     => 'array',
                'required' => false,
            ]
        ];
    }
}
