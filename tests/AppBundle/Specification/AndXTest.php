<?php

namespace tests\AppBundle\Specification;

use AppBundle\Specification\AndX;
use AppBundle\Specification\Specification;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class AndXTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_returns_the_result_of_x_and_y()
    {
        $first = $this->prophesize(Specification::class);
        $second = $this->prophesize(Specification::class);
        $andx = new AndX($first->reveal(), $second->reveal());

        $first->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $second->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $this->assertTrue($andx->isSatisfiedBy('foo'));

        $first->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(false);
        $second->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(false);
        $this->assertFalse($andx->isSatisfiedBy('foo'));

        $first->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $second->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(false);
        $this->assertFalse($andx->isSatisfiedBy('foo'));

        $first->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(false);
        $second->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $this->assertFalse($andx->isSatisfiedBy('foo'));
    }

    public function test_it_returns_the_result_with_multiple_inputs()
    {
        $first = $this->prophesize(Specification::class);
        $second = $this->prophesize(Specification::class);
        $third = $this->prophesize(Specification::class);
        $andx = new AndX($first->reveal(), $second->reveal(), $third->reveal());

        $first->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $second->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $third->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $this->assertTrue($andx->isSatisfiedBy('foo'));

        $first->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $second->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(true);
        $third->isSatisfiedBy('foo')->shouldBeCalled()->willReturn(false);
        $this->assertFalse($andx->isSatisfiedBy('foo'));
    }
}
