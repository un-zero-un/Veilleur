<?php

namespace tests\AppBundle\Specification;

use AppBundle\Specification\IsHumanMessage;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class IsHumanMessageTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_let_pass_message()
    {
        $data = new \stdClass;
        $data->type = 'message';
        $data->text = 'message';

        $this->assertTrue((new IsHumanMessage)->isSatisfiedBy($data));
    }

    public function test_it_does_not_let_pass_ping()
    {
        $data = new \stdClass;
        $data->type   = 'message';
        $data->text   = 'message';
        $data->bot_id = 'ABCDE';

        $this->assertFalse((new IsHumanMessage)->isSatisfiedBy($data));
    }
}
