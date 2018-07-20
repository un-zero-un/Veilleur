<?php

declare (ticks = 1);

namespace AppBundle\Command;

use AppBundle\Api\SlackApi;
use AppBundle\Entity\ProcessedSlackMessage;
use AppBundle\Entity\WatchLink;
use AppBundle\Specification\AndX;
use AppBundle\Specification\IsHumanMessage;
use AppBundle\Specification\IsInChannel;
use AppBundle\Specification\IsNotOld;
use AppBundle\Specification\IsOriginalMessage;
use AppBundle\Specification\IsSlackMessage;
use AppBundle\Websocket\Client;
use Doctrine\DBAL\Exception\DriverException;
use Doctrine\ORM\EntityManager;
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

            return;
        }

        /** @var SlackApi $slack */
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

            return;
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

                ++$pingId;
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
            /** @var WatchLink $watchLink */
            $watchLink = $this->processMessage($ws->receive(), $channelId, $io, $latest);

            if (null === $watchLink) {
                continue;
            }

            $ws->send(
                json_encode(
                    [
                        'id'      => $watchLink->getId(),
                        'type'    => 'message',
                        'channel' => $channelId,
                        'text'    => 'Message reçu et enregistré. (Id : ' . $watchLink->getId() . ')',
                    ]
                )
            );

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

        if (!(new AndX(
            new IsSlackMessage(),
            new IsHumanMessage(),
            new IsInChannel($channelId),
            new IsOriginalMessage(),
            new IsNotOld($latest->getDate())
        ))->isSatisfiedBy($data)
        ) {
            return;
        }

        $io->writeln('Received message : ' . $data->text);

        try {
            $url       = $this->container->get('parser.slack_message')->parseUrl($data->text);
            $tags      = $this->container->get('parser.slack_message')->parseTags($data->text);
            $watchLink = $this->container->get('extractor.watch_link_metadata')->extract($url, $tags);
            $watchLink->setCreatedAt(\DateTime::createFromFormat('U.u', $data->ts));

            $io->note('Parsing ' . $url);

            /** @var EntityManager $em */
            $em               = $this->container->get('doctrine')->getManager();
            $processedMessage = new ProcessedSlackMessage($watchLink->getCreatedAt());

            $em->transactional(function () use ($em, $watchLink, $processedMessage) {
                $em->getRepository(WatchLink::class)->declare($watchLink);
                $em->persist($processedMessage);
            });

            return $watchLink;
        } catch (\InvalidArgumentException $e) {
            $this->container->get('logger')->addNotice(
                'Unable to insert watchlink',
                [
                    'exception' => $e,
                    'errmsg'    => $e->getMessage(),
                    'message'   => $data->text,
                ]
            );
        } catch (DriverException $e) {
            $this->container->get('logger')->addError(
                'Database exception',
                [
                    'exception' => $e,
                    'errmsg'    => $e->getMessage(),
                    'message'   => $data->text,
                ]
            );

            exit(1);
        } catch (\Exception $e) {
            $this->container->get('logger')->addError(
                'Unknown exception',
                [
                    'exception' => $e,
                    'errmsg'    => $e->getMessage(),
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

        return isset($data->type) && 'pong' === $data->type;
    }
}
