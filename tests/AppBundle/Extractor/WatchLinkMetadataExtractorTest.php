<?php

namespace Tests\AppBundle\Extractor;
use AppBundle\Entity\WatchLink;
use AppBundle\Extractor\WatchLinkMetadataExtractor;
use AppBundle\Fetcher\Fetcher;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class WatchLinkMetadataExtractorTest extends \PHPUnit_Framework_TestCase
{
    public function test_it_extracts_metadata()
    {
        $fetcher = $this->prophesize(Fetcher::class);
        $fetcher
            ->fetch('https://foo.bar/baz')
            ->shouldBeCalled()
            ->willReturn(file_get_contents(__FILE__, null, null, __COMPILER_HALT_OFFSET__));

        $extractor = new WatchLinkMetadataExtractor($fetcher->reveal());

        $link = $extractor->extract('https://foo.bar/baz');
        $this->assertInstanceOf(WatchLink::class, $link);
        $this->assertSame('Universal React', $link->getName());
        $this->assertSame('https://foo.bar/baz', $link->getUrl());
        $this->assertSame('Jack Franklin darns the holes left in our applications by exploring how our client-side JavaScript frameworks might also be run on the server to provide universal support for all types of user. How will you react when you see mommy kissing Server Claus?', $link->getDescription());
        $this->assertSame('https://cloud.24ways.org/authors/jackfranklin160.jpg', $link->getImage());
    }
}


__halt_compiler();
<!DOCTYPE html>
<html lang="en-gb">
<head>
    <meta charset="utf-8"/>
    <link rel="alternate" type="application/rss+xml" href="http://feeds.feedburner.com/24ways"/>
    <meta name="robots" content="index, follow"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="application-name" property="og:site_name" content="24 ways"/>
    <meta name="apple-mobile-web-app-title" content="24 ways"/>
    <meta property="og:url" name="twitter:url" content="https://24ways.org/2015/universal-react/"/>
    <meta property="og:title" name="twitter:title" content="Universal React"/>
    <meta property="og:description" name="twitter:description"
          content="Jack Franklin darns the holes left in our applications by exploring how our client-side JavaScript frameworks might also be run on the server to provide universal support for all types of user. How will you react when you see mommy kissing Server Claus?"/>
    <meta property="og:image" name="twitter:image" content="https://cloud.24ways.org/authors/jackfranklin160.jpg"/>
    <meta property="og:type" content="article"/>
    <meta property="article:author" content="https://www.facebook.com/24ways"/>
    <meta name="twitter:site" content="@24ways"/>
    <meta name="twitter:creator" content="@jack_franklin"/>
    <meta name="twitter:card" content="summary"/>

    <title>Universal React &#9670; 24 ways</title>
</head>

<body></body>
</html>
