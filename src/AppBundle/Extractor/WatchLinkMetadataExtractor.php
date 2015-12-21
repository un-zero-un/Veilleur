<?php

namespace AppBundle\Extractor;

use AppBundle\Entity\Repository\TagRepository;
use AppBundle\Entity\Tag;
use AppBundle\Entity\WatchLink;
use AppBundle\Fetcher\Fetcher;
use Symfony\Component\DomCrawler\Crawler;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class WatchLinkMetadataExtractor
{
    /**
     * @var Fetcher
     */
    private $fetcher;

    /**
     * @var TagRepository
     */
    private $tagRepository;

    /**
     * @var Crawler
     */
    private $crawler;

    public function __construct(Fetcher $fetcher, TagRepository $tagRepository, Crawler $crawler = null)
    {
        $this->fetcher = $fetcher;
        $this->tagRepository = $tagRepository;
        $this->crawler = $crawler ?: new Crawler();
    }

    /**
     * @param string $url
     * @param array  $tags
     *
     * @return WatchLink
     */
    public function extract(string $url, array $tags): WatchLink
    {
        $watchLink = new WatchLink;
        $watchLink->setUrl($url);

        $this->crawler->clear();
        $this->crawler->addHtmlContent($this->fetcher->fetch($url));

        $watchLink->setName($this->extractTitle());
        $watchLink->setDescription($this->extractDescription());
        $watchLink->setImage($this->extractImage());

        foreach ($tags as $tag) {
            $watchLink->addTag($this->tagRepository->findOrCreate($tag));
        }

        return $watchLink;
    }

    /**
     * @return string
     */
    private function extractTitle()
    {
        if (0 !== count($this->crawler->filter('[property="og:title"]'))) {
            return $this->crawler->filter('[property="og:title"]')->attr('content');
        }

        if (0 !== count($this->crawler->filter('[name="twitter:title"]'))) {
            return $this->crawler->filter('[property="og:title"]')->attr('content');
        }

        if (0 !== count($this->crawler->filter('title'))) {
            return $this->crawler->filter('title')->text();
        }

        return null;
    }

    /**
     * @return string
     */
    private function extractDescription()
    {
        if (0 !== count($this->crawler->filter('[property="og:description"]'))) {
            return $this->crawler->filter('[property="og:description"]')->attr('content');
        }

        if (0 !== count($this->crawler->filter('[name="twitter:description"]'))) {
            return $this->crawler->filter('[name="twitter:description"]')->attr('content');
        }

        if (0 !== count($this->crawler->filter('[name="description"]'))) {
            return $this->crawler->filter('[name="description"]')->attr('content');
        }

        return null;
    }

    /**
     * @return string
     */
    private function extractImage()
    {
        if (0 !== count($this->crawler->filter('[property="og:image"]'))) {
            return $this->crawler->filter('[property="og:image"]')->attr('content');
        }

        if (0 !== count($this->crawler->filter('[name="twitter:image"]'))) {
            return $this->crawler->filter('[name="twitter:image"]')->attr('content');
        }

        return null;
    }
}
