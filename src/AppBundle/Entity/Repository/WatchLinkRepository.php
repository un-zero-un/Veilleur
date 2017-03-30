<?php

namespace AppBundle\Entity\Repository;

use AppBundle\Entity\WatchLink;
use Doctrine\ORM\EntityRepository;

/**
 * @author Yohan Giarelli <yohan@un-zero-un.fr>
 */
class WatchLinkRepository extends EntityRepository
{
    public function declare(WatchLink $watchLink)
    {
        $this->createQueryBuilder('w')
            ->update()
            ->set('w.overridden', true)
            ->where('w.url = :url')
            ->setParameter('url', $watchLink->getUrl())
            ->getQuery()
            ->execute();

        $this->getEntityManager()->persist($watchLink);
    }
}
