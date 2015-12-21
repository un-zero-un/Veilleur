<?php

namespace tests\AppBundle\Specification;

use AppBundle\Specification\IsOriginalMessage;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsOriginalMessageTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_is_original_message()
    {
        $message = new \stdClass();
        $this->assertTrue((new IsOriginalMessage)->isSatisfiedBy($message));

        $message = new \stdClass();
        $message->subtype = 'foobar';
        $this->assertFalse((new IsOriginalMessage)->isSatisfiedBy($message));
    }
}
