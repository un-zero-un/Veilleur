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
     * @dataProvider it_parses_messages_data_url_provider
     */
    public function test_it_parses_messages_url(string $message, string $url)
    {
        $this->assertSame($url, $this->parser->parseUrl($message));
    }

    /**
     * @dataProvider      it_throws_exception_for_bad_messages_url_provider
     * @expectedException \InvalidArgumentException
     */
    public function test_it_throws_exception_for_bad_messages_url(string $message)
    {
        $this->parser->parseUrl($message);
    }

    /**
     * @dataProvider it_parses_messages_tags_provider
     */
    public function test_it_parses_messages_tags(string $message, array $rawTags)
    {
        $tags = $this->parser->parseTags($message);

        $this->assertCount(count($rawTags), $tags);
        foreach ($rawTags as $rawTag) {
            $found = false;
            foreach ($tags as $tag) {
                if ($tag === $rawTag) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $this->fail('Missing tag ' . $rawTag);
            }
        }
    }

    public function it_parses_messages_data_url_provider()
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

    public function it_throws_exception_for_bad_messages_url_provider()
    {
        return [
            ['Y’a rien là ?'],
            ['http: que dalle']
        ];
    }

    public function it_parses_messages_tags_provider()
    {
        return [
            ['https://developers.google.com/web/updates/2015/11/app-shell?hl=en #worker #service', ['worker', 'service']],
            ['http://angularjs.blogspot.fr/2015/12/angular-2-beta.html \o/ #angular #js #front-end #framework #release', ['angular', 'js', 'front-end', 'framework', 'release']],
            ['http://ionicframework.com/docs/components/#header', []],
            ['http://ionicframework.com/docs/components/#header #foobar', ['foobar']],
        ];
    }
}
