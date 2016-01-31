<?php

namespace AppBundle\Command;

use AppBundle\Entity\ProcessedSlackMessage;
use AppBundle\Specification\AndX;
use AppBundle\Specification\IsHumanMessage;
use AppBundle\Specification\IsSlackMessage;
use Doctrine\ORM\NoResultException;
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

        $om = $this->container->get('doctrine')->getManager();
        $slack = $this->container->get('slack.api');
        $args = ['channel' => $slack->findChannelId($this->container->getParameter('slack_web_channel')), 'count' => 1000];

        try {
            $latest = $om->getRepository(ProcessedSlackMessage::class)->findMostRecent();
            $args['oldest'] = $latest->getDate()->format('U.u');
        } catch (NoResultException $e) {
        }

        $response = $slack->request('channels.history', $args);

        $messages = json_decode($response)->messages;
        $io->progressStart(count($messages));
        foreach ($messages as $message) {
            $io->progressAdvance();
            if (!(new AndX(new IsSlackMessage(), new IsHumanMessage()))->isSatisfiedBy($message)) {
                continue;
            }

            try {
                $url       = $this->container->get('parser.slack_message')->parseUrl($message->text);
                $tags      = $this->container->get('parser.slack_message')->parseTags($message->text);
                $watchLink = $this->container->get('extractor.watch_link_metadata')->extract($url, $tags);

                $watchLink->setCreatedAt((new \DateTime())->setTimestamp($message->ts));

                $processedMessage = new ProcessedSlackMessage($watchLink->getCreatedAt());
                $om->persist($processedMessage);
                $om->persist($watchLink);

                // Flush required at each round for tags unicity
                $om->flush();
            } catch (\InvalidArgumentException $e) {
                $this->container->get('logger')->addNotice(
                    'Unable to insert watchlink',
                    [
                        'exception' => $e,
                        'message' => $message->text,
                    ]
                );
            } catch (\Exception $e) {
                $this->container->get('logger')->addError(
                    'Unknow exception',
                    [
                        'exception' => $e,
                        'message'   => $message->text,
                    ]
                );
            }
        }
        $io->progressFinish();

        $io->comment('Flush links…');

        $io->comment('Done.');
    }
}
