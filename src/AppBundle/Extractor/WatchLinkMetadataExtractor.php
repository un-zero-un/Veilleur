<?php

namespace AppBundle\Extractor;

use AppBundle\Entity\Repository\TagRepository;
use AppBundle\Entity\WatchLink;
use AppBundle\Parser\UrlParser;
use AppBundle\Fetcher\Fetcher;
use Symfony\Component\DomCrawler\Crawler;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class WatchLinkMetadataExtractor
{
    /**
     * @var UrlParser
     */
    private $urlParser;

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

    public function __construct(UrlParser $urlParser, Fetcher $fetcher, TagRepository $tagRepository, Crawler $crawler = null)
    {
        $this->urlParser = $urlParser;
        $this->fetcher = $fetcher;
        $this->tagRepository = $tagRepository;
        $this->crawler = $crawler ?: new Crawler();
    }

    public function bounds($text, $length = 255) {
        if (strlen($text) > $length) {
            return substr($text, 0, $length);
        }
        return $text;
    }

    /**
     * @param string $url
     * @param array $tags
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @return WatchLink
     */
    public function extract(string $url, array $tags): WatchLink
    {
        $watchLink = new WatchLink;
        $watchLink->setUrl($url);

        $this->crawler->clear();
        $this->crawler->addHtmlContent($this->fetcher->fetch($url));

        $watchLink->setName($this->bounds($this->extractTitle()));

        $watchLink->setDescription($this->bounds($this->extractDescription()));

        $imageURL = $this->extractImage();
        if (null !== $imageURL) {
            $imageURL = $this->urlParser->getAbsolutePath($url, $imageURL);
            $imageURL = $this->bounds($imageURL, 1024);
        }

        $watchLink->setImage($imageURL);


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
            return $this->crawler->filter('[name="twitter:title"]')->attr('content');
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
