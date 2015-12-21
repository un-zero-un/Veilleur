<?php

namespace AppBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class ProcessedSlackMessageRepository extends EntityRepository
{
    /**
     * @return \AppBundle\Entity\ProcessedSlackMessage
     *
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findMostRecent()
    {
        return $this->createQueryBuilder('psm')
            ->orderBy('psm.date')
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleResult();
    }
}
