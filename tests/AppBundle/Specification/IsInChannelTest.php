<?php

namespace tests\AppBundle\Specification;

use AppBundle\Specification\IsInChannel;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsInChannelTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_is_in_channel()
    {
        $message = new \stdClass();
        $message->channel = 'foobar';
        $this->assertTrue((new IsInChannel('foobar'))->isSatisfiedBy($message));


        $message = new \stdClass();
        $message->channel = 'bazqux';
        $this->assertFalse((new IsInChannel('foobar'))->isSatisfiedBy($message));
    }
}
