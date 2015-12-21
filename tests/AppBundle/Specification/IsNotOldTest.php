<?php

namespace tests\AppBundle\Specification;

use AppBundle\Specification\IsNotOld;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsNotOldTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_is_in_channel()
    {
        $message = new \stdClass();
        $message->ts = (new \DateTime('+1 month'))->format('U.u');
        $this->assertTrue((new IsNotOld(new \DateTime))->isSatisfiedBy($message));

        $message = new \stdClass();
        $message->ts = (new \DateTime('-1 month'))->format('U.u');
        $this->assertFalse((new IsNotOld(new \DateTime))->isSatisfiedBy($message));
    }
}
