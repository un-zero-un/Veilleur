<?php

namespace AppBundle\Entity\Repository;

use AppBundle\Entity\Tag;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NoResultException;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class TagRepository extends EntityRepository
{
    /**
     * @param string $name
     *
     * @return Tag
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOrCreate(string $name): Tag
    {
        try {
            $this->createQueryBuilder('t')
                ->where('t.name = :name')
                ->setParameter('name', $name)
                ->setMaxResults(1)
                ->getQuery()
                ->getSingleResult();
        } catch (NoResultException $e) {
            $tag = new Tag($name);
            $this->getEntityManager()->persist($tag);

            return $tag;
        }
    }
}
