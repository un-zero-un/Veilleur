<?php

namespace Tests\AppBundle\Parser;

use AppBundle\Parser\SlackMessageParser;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class SlackMessageParserTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var SlackMessageParser
     */
    protected $parser;

    protected function setUp()
    {
        $this->parser = new SlackMessageParser;
    }

    /**
     * @dataProvider it_parses_messages_data_provider
     */
    public function test_it_parses_messages($message, $url)
    {
        $this->assertSame($url, $this->parser->parse($message));
    }

    /**
     * @dataProvider      it_throws_exception_for_bad_messages
     * @expectedException \InvalidArgumentException
     */
    public function test_it_throws_exception_for_bad_messages($message)
    {
        $this->parser->parse($message);
    }

    public function it_parses_messages_data_provider()
    {
        return [
            ['https://github.com', 'https://github.com'],
            ['https://github.com Foo, bar baz', 'https://github.com'],
            ['https://github.com/ Foo, bar baz', 'https://github.com/'],
            ['Foo http://localhost:8000/toto Foo, bar baz', 'http://localhost:8000/toto'],
            ['Foo http://localhost:8000/toto#anchor-that Foo, bar baz', 'http://localhost:8000/toto#anchor-that'],
            ['Foo http://localhost:8000/toto?query-that&foo=toto Foo, bar baz', 'http://localhost:8000/toto?query-that&foo=toto'],
            ['Foo http://localhost:8000/toto?query-that&foo=toto#baz Foo, bar baz', 'http://localhost:8000/toto?query-that&foo=toto#baz'],
            ['https://github.com/chenglou/react-motion', 'https://github.com/chenglou/react-motion'],
            ['http://angularjs.blogspot.fr/2015/12/angular-2-beta.html \o/ #angular #js #front-end #framework #release', 'http://angularjs.blogspot.fr/2015/12/angular-2-beta.html'],
            ['https://twitter.com/francoisz/status/677114293524021250 #api #standard', 'https://twitter.com/francoisz/status/677114293524021250'],
            ['<https://twitter.com/francoisz/status/677114293524021250> #api #standard', 'https://twitter.com/francoisz/status/677114293524021250'],
            ['http://www.pantone.com/pages/fcr/?season=Spring&amp;year=2016&amp;from=topNav', 'http://www.pantone.com/pages/fcr/?season=Spring&year=2016&from=topNav'],
            ['<https://www.un-zero-un.fr>', 'https://www.un-zero-un.fr'],
        ];
    }

    public function it_throws_exception_for_bad_messages()
    {
        return [
            ['Y’a rien là ?'],
            ['http: que dalle']
        ];
    }
}
