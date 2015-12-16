<?php

namespace AppBundle\Parser;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class SlackMessageParser
{
    const URL_PATTERN = '~(?<url>
        (?<scheme>(http)|(https))://  # Matches the scheme, http or https
        (?<host>[^ /]+)               # Matches the host, could be anything but / or space
        (?<port>:\d+)?                # Matches the port, should be a digit
        (?<path>(/[^ /#]*))*          # Matches the path, could be anything but / or space
        (?<query>\?[^?#]*)?           # Matches the query, could be anything but / or space
        (?<anchor>(\#\S*))?           # Matches the anchor, could be anything but # or space
    )~ix';

    /**
     * @param string $message
     *
     * @return string
     */
    public function parse($message)
    {
        $matches = null;
        if (preg_match(self::URL_PATTERN, $message, $matches)) {
            return $matches['url'];
        }

        throw new \InvalidArgumentException('No URL found in slack message');
    }
}
