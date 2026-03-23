<?php

namespace SpiceCRM\modules\Leads\api\controllers;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\Leads\Lead;

class LeadGenerateController
{
    /**
     * generate lead by AI prompt
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function generateLeadByAIPrompt(Request $req, Response $res, array $args): Response
    {
        /** @var array{file: string, filename: string, mime: string} $file */
        $file = $req->getParsedBody();
        /** @var Lead $lead */
        $lead = BeanFactory::newBean('Leads');
        $lead = $lead->generateLeadByAIPrompt($args['promptId'], $file);

        return $res->withJson(['id' => $lead->id]);
    }
}