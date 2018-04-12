<?php

namespace AppBundle\Filter;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpFoundation\RequestStack;

class SearchFilter extends AbstractFilter
{

    public function __construct(ManagerRegistry $doctrine, RequestStack $requestStack)
    {
        parent::__construct($doctrine, $requestStack, null, ['search' => null]);
    }


    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null/*, array $context = []*/)
    {
        $request = $this->requestStack->getCurrentRequest();
        if (!$request->query->has('search') || $property !== 'search') {
            return;
        }

        $i = 0;
        foreach (explode(" ", $value) as $val){
            $queryBuilder->andWhere("UPPER(" . $queryBuilder->getRootAliases()[0] . ".name) LIKE CONCAT('%', UPPER(:search_" . $i . "), '%')")
                         ->setParameter('search_' . $i, $val);
            ++$i;
        }
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            "search" => [
                "property" => "search",
                "type" => "string",
                "required" => false
            ]
        ];
    }
}