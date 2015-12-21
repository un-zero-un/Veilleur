<?php

namespace tests\AppBundle\Specification;

use AppBundle\Specification\IsSlackMessage;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsSlackMessageTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_let_pass_message()
    {
        $data = new \stdClass();
        $data->type = 'message';
        $data->text = 'message';

        $this->assertTrue((new IsSlackMessage())->isSatisfiedBy($data));
    }

    public function test_it_does_not_let_pass_ping()
    {
        $data = new \stdClass();
        $data->type = 'ping';

        $this->assertFalse((new IsSlackMessage())->isSatisfiedBy($data));
    }
}
