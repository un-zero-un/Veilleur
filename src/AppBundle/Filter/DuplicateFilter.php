<?php
namespace AppBundle\Filter;

use \ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractFilter;
use AppBundle\Entity\Tag;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\RequestStack;

class DuplicateFilter extends AbstractFilter {

    public function __construct(ManagerRegistry $doctrine, RequestStack $rs)
    {
        parent::__construct($doctrine, $rs, null, ['show_duplicates' => null]);
    }

    protected function filterProperty(string $property, $value, \Doctrine\ORM\QueryBuilder $queryBuilder, \ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null/*, array $context = []*/)
    {
        $bool = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        if ($resourceClass !== Tag::class || $property !== "show_duplicates") {
            return;
        }

        if (!$bool)
            $queryBuilder->andWhere($queryBuilder->getRootAliases()[0].'.mainTag is null');
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            "show_duplicates"   => [
                "property" => "show_duplicates",
                "type"     => "bool",
                "required" => false
            ]
        ];
    }
}
