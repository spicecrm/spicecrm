<?php

$app->group('/EmailTemplates', function () use ($app) {
    $app->get('/:module', function ($module) use ($app) {
        global $db;

        $template_list = array();

        $res = $db->query("SELECT id, name FROM email_templates 
                WHERE type = 'bean2mail' AND (for_bean = '$module' OR for_bean = '*' )");
        while($row = $db->fetchByAssoc($res)) $template_list[] = $row;

        echo json_encode($template_list);
    });
    $app->get('/parse/:id/:module/:parent', function ($id, $module, $parent) use ($app) {
        global $app_list_strings, $current_language, $current_user;

        $app_list_strings = return_app_list_strings_language($current_language);

        $return = array(
            'name' => '',
            'description_html' => ''
        );
        $tpl = BeanFactory::getBean("EmailTemplates",$id);
        $bean = BeanFactory::getBean($module, $parent);
        $parsedTpl = $tpl->parse($bean);

        echo json_encode(array(
            'subject' => $parsedTpl['subject'],
            'body_html' => from_html(wordwrap($parsedTpl['body_html'], true)),
            'body' => $parsedTpl['body']
        ));
    });
});
