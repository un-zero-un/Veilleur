<?php

namespace AppBundle\Parser;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class SlackMessageParser
{
    const URL_PATTERN = '~
        [<]?
        (?<url>
            (?<scheme>(http)|(https))://  # Matches the scheme, http or https
            (?<host>[^\s/>]+)              # Matches the host, could be anything but / or space
            (?<port>:\d+)?                # Matches the port, should be a digit
            (?<path>(/[^\s/#>?]*))*       # Matches the path, could be anything but / or space
            (?<query>\?[^?#>\s]*)?        # Matches the query, could be anything but / or space
            (?<anchor>(\#[^\s>]*))?       # Matches the anchor, could be anything but # or space
        )
        [>]?
    ~ix';

    const TAG_PATTERN = '~(\s\#(?<tag>[\w-]+))~ix';

    /**
     * @param string $message
     *
     * @return string
     */
    public function parseUrl(string $message): string
    {
        $matches = null;
        if (!preg_match(self::URL_PATTERN, $message, $matches)) {
            throw new \InvalidArgumentException('No URL found in slack message');
        }

        $url = $matches['url'];
        if (!isset($matches['query'])) {
            return $url;
        }

        $query = preg_replace('#&amp;(\w+)=#i', '&$1=', $matches['query']);
        $url   = str_replace($matches['query'], $query, $url);

        return $url;
    }
    /**
     * @param string $message
     *
     * @return array
     */
    public function parseTags(string $message): array
    {
        $matches = null;
        if (!preg_match_all(self::TAG_PATTERN, $message, $matches)) {
            return [];
        }

        return $matches['tag'];
    }
}
