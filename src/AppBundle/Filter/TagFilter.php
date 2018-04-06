<?php

namespace AppBundle\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class TagFilter extends AbstractFilter
{
    public function __construct(ManagerRegistry $doctrine, RequestStack $requestStack)
    {
        parent::__construct($doctrine, $requestStack, null, ['tags' => null]);
    }

    /**
     * {@inheritdoc}
     */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null) {
        $request = $this->requestStack->getCurrentRequest();
        if (!$request->query->has('tags') || $property !== 'tags') {
            return;
        }

        foreach ($value as $i => $tag)
        {
            $queryBuilder->innerJoin($queryBuilder->getRootAliases()[0].'.tags', 't'.$i)
                ->andWhere('t'.$i.'.name = :name_'.$i)
                ->setParameter('name_'.$i, $tag);
        }

    }

    /**
     * {@inheritdoc}
     */
    public function getDescription(string $resource): array
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
