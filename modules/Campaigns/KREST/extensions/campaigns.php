<?php
require_once 'modules/Campaigns/utils.php';
require_once 'include/SpiceMailRelais/SpiceMailRelais.php';

$app->group('/campaigns', function () use ($app) {
    $app->get('/sendmail/:campaignid', function ($campaignid) use ($app) {
        global $db, $current_user;
        $campaign = BeanFactory::getBean('Campaigns',$campaignid);
        $campaign->track_prospects('queued');
        echo json_encode(array('success' => true));
    });
    $app->get('/sendtestmail/:campaignid', function ($campaignid) use ($app) {
        global $db;
        $campaign = BeanFactory::getBean('Campaigns',$campaignid);

        $mailrelais = new SpiceMailRelais($campaign->mailrelais);

        $tpl = BeanFactory::getBean('EmailTemplates',$campaign->email_template_id);
        $res = $db->query("SELECT plp.related_id, plp.related_type FROM prospect_list_campaigns plc INNER JOIN prospect_lists pl ON pl.list_type = 'test' AND plc.campaign_id = '{$campaign->id}' AND plc.prospect_list_id = pl.id INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = pl.id WHERE plc.deleted = 0 AND pl.deleted = 0 AND plp.deleted = 0");
        while($row = $db->fetchByAssoc($res)){
            $bean = BeanFactory::getBean($row['related_type'], $row['related_id']);
            if($bean->hasEmails()) {
                $parsedTpl = $tpl->parse($bean);

                if(!empty($parsedTpl['body'])) $mailrelais->addContent($parsedTpl['body']);
                if(!empty($parsedTpl['body_html'])) $mailrelais->addContent(from_html(wordwrap($parsedTpl['body_html'], true)), 'text/html');
                $mailrelais->setSubject($parsedTpl['subject']);
                $mailrelais->addAddress($bean->emailAddress->getPrimaryAddress($bean), $bean->get_summary_text());
                $mailrelais->send();
            }
        }
        echo json_encode(array('success' => true));
    });
    $app->get('/getMailRelais', function () use ($app) {
        global $db;
        //for now static function for Campaigns field mailrelais
        $retArray = array();
        $retArray[] = array(
            'value' => '',
            'display' => ''
        );
        $res = $db->query("SELECT id, name, service FROM sysmailrelais");
        while($row = $db->fetchByAssoc($res)){
            $retArray[] = array(
                'value' => $row['id'],
                'display' => $row['name']." (".$row['service'].")"
            );
        }
        echo json_encode($retArray);
    });
});