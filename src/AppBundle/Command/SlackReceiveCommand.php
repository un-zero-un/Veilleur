<?php

declare(ticks = 1);

namespace AppBundle\Command;

use AppBundle\Entity\ProcessedSlackMessage;
use AppBundle\Specification\Andx;
use AppBundle\Specification\IsHumanMessage;
use AppBundle\Specification\IsInChannel;
use AppBundle\Specification\IsNotOld;
use AppBundle\Specification\IsOriginalMessage;
use AppBundle\Specification\IsSlackMessage;
use AppBundle\Websocket\Client;
use Doctrine\ORM\NoResultException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use WebSocket\ConnectionException;

/**
 * @author Yohan Giarelli <yohan@giarel.li>
 */
class SlackReceiveCommand extends Command implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected function configure()
    {
        $this->setName('veilleur:slack:receive');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Slack receive');
        $io->comment('Requesting slack websocket…');

        $latest = null;
        try {
            $latest = $this->container->get('doctrine')->getRepository(ProcessedSlackMessage::class)->findMostRecent();
        } catch (NoResultException $e) {
            $io->error('No message found in base, you should import first.');

            exit;
        }

        $slack     = $this->container->get('slack.api');
        $channelId = $slack->findChannelId($this->container->getParameter('slack_web_channel'));
        $response  = $slack->request('rtm.start');

        $io->comment('Socket URL received, connecting…');

        $ws = new Client(json_decode($response)->url);

        $io->comment('Connected.');

        $exit = function ($sig) use ($ws, $io) {
            $io->comment('Received closing signal ' . $sig);
            $ws->close();
            $io->comment('Exiting.');

            exit;
        };

        foreach ([SIGTERM, SIGINT, SIGQUIT, SIGHUP] as $sig) {
            pcntl_signal($sig, $exit);
        }

        $ws->setTimeout(20);

        $pingId = 1;
        while (true) {
            try {
                pcntl_signal_dispatch();
                $this->receive($ws, $channelId, $io, $latest);
            } catch (ConnectionException $e) {
                $io->note('Sending Ping…');
                $ws->send(json_encode(['id' => $pingId, 'type' => 'ping']));
                if (!$this->isPong($ws->receive())) {
                    break;
                }

                $pingId++;
            }
        }

        $ws->close();
    }

    /**
     * @param Client                $ws
     * @param string                $channelId
     * @param SymfonyStyle          $io
     * @param ProcessedSlackMessage $latest
     */
    private function receive(Client $ws, $channelId, SymfonyStyle $io, ProcessedSlackMessage $latest)
    {
        while (true) {
            $this->processMessage($ws->receive(), $channelId, $io, $latest);

            sleep(1);
        }
    }

    /**
     * @param string                $message
     * @param string                $channelId
     * @param SymfonyStyle          $io
     * @param ProcessedSlackMessage $latest
     */
    private function processMessage($message, $channelId, SymfonyStyle $io, ProcessedSlackMessage $latest)
    {
        if (null === $message) {
            return;
        }

        $data = json_decode($message);

        if (!(new Andx(
            new IsSlackMessage(),
            new IsHumanMessage(),
            new IsInChannel($channelId),
            new IsOriginalMessage(),
            new IsNotOld($latest->getDate())
        ))->isSatisfiedBy($data)) {
            return;
        }

        try {
            $url       = $this->container->get('parser.slack_message')->parseUrl($data->text);
            $tags      = $this->container->get('parser.slack_message')->parseTags($data->text);
            $watchLink = $this->container->get('extractor.watch_link_metadata')->extract($url, $tags);
            $watchLink->setCreatedAt(\DateTime::createFromFormat('U.u', $data->ts));

            $io->note('Parsing ' . $url);

            $processedMessage = new ProcessedSlackMessage($watchLink->getCreatedAt());
            $this->container->get('doctrine')->getManager()->persist($watchLink);
            $this->container->get('doctrine')->getManager()->persist($processedMessage);
            $this->container->get('doctrine')->getManager()->flush();
        } catch (\InvalidArgumentException $e) {
            $this->container->get('logger')->addNotice(
                'Unable to insert watchlink',
                [
                    'exception' => $e,
                    'message'   => $data->text,
                ]
            );
        }
    }

    /**
     * @param string $message
     *
     * @return bool
     */
    private function isPong($message)
    {
        $data = json_decode($message);

        return 'pong' === $data->type;
    }
}
