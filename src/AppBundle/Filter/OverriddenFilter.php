<?php

namespace AppBundle\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use AppBundle\Entity\WatchLink;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class OverriddenFilter extends AbstractFilter
{
    public function __construct(ManagerRegistry $doctrine, RequestStack $rs)
    {
        parent::__construct($doctrine, $rs, null, ['overridden' => null]);
    }

    /**
     * {@inheritdoc}
     */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $bool = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        if ($resourceClass !== WatchLink::class || $property !== "overridden") {
            return;
        }


        $queryBuilder->andWhere($queryBuilder->getRootAliases()[0].'.overridden = :val')
                     ->setParameter("val", $bool);
    }

    /**
     * {@inheritdoc}
     */
    public function getDescription(string $resource): array
    {
        return [
            "overridden"   => [
                "property" => "overridden",
                "type"     => "bool",
                "required" => false
            ]
        ];
    }
}
