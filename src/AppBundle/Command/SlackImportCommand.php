<?php

namespace AppBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class SlackImportCommand extends Command implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected function configure()
    {
        $this->setName('veilleur:slack:import');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Slack import');
        $io->comment('Requesting slack history…');

        $response = $this->sendSlackRequest(
            'channels.history',
            ['channel' => $this->getChannelId(), 'count' => 1000]
        );

        $messages = json_decode($response)->messages;
        $io->progressStart(count($messages));
        foreach ($messages as $message) {
            $io->progressAdvance();
            if (isset($message->bot_id)) {
                continue;
            }

            if (!isset($message->text)) {
                continue;
            }

            try {
                $url       = $this->container->get('parser.slack_message')->parse($message->text);
                $watchLink = $this->container->get('extractor.watch_link_metadata')->extract($url);

                $this->container->get('doctrine')->getManager()->persist($watchLink);
            } catch (\InvalidArgumentException $e) {}
        }
        $io->progressFinish();

        $io->comment('Flush links…');

        $this->container->get('doctrine')->getManager()->flush();

        $io->comment('Done.');
    }

    private function getChannelId()
    {
        $response = $this->sendSlackRequest('channels.list');

        foreach (json_decode($response)->channels as $channel) {
            if ($channel->name === $this->container->getParameter('slack_web_channel')) {
                return $channel->id;
            }
        }

        throw new \RuntimeException('No channel found');
    }

    /**
     * @param string $method
     * @param array  $args
     *
     * @return string
     */
    private function sendSlackRequest($method, array $args = [])
    {
        $url = sprintf(
            'https://slack.com/api/%s?%s',
            $method,
            http_build_query(array_merge(['token' => $this->container->getParameter('slack_web_api_token')], $args))
        );

        return $this->container->get('guzzle.client')->request('GET', $url)->getBody()->getContents();
    }
}
