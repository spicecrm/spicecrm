<?php

namespace SpiceCRM\modules\Accounts\api\controllers;

use Psr\http\Message\RequestInterface;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;



class AccountsHierarchyController{

    /**
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function getAccountHierarchyId(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $hierarchy = [];

        $seed = BeanFactory::getBean('Accounts', $args['id']);
        $seed->load_relationship('members');
        $memberAccounts = $seed->get_linked_beans('members', 'Account');
        foreach ($memberAccounts as $memberAccount) {
            $memberCount = $db->fetchByAssoc($db->query("SELECT count(id) membercount FROM accounts WHERE parent_id = '$memberAccount->id' AND deleted = 0"));
            $hierarchy[] =  [
                'id' => $memberAccount->id,
                'summary_text' => $memberAccount->get_summary_text(),
                'member_count' => $memberCount['membercount']
            ];
        }
        return $res->withJson($hierarchy);
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function getACLAction($req,$res,$args){
        $db = DBManagerFactory::getInstance();

        $hierarchy = [];

        $args['addfields'] = json_decode(html_entity_decode($args['addfields']));

        $seed = BeanFactory::getBean('Accounts', $args['id']);
        $seed->load_relationship('members');
        $memberAccounts = $seed->get_linked_beans('members', 'Accounts');
        foreach ($memberAccounts as $memberAccount) {
            $memberCount = $db->fetchByAssoc($db->query("SELECT count(id) membercount FROM accounts WHERE parent_id = '$memberAccount->id' AND deleted = 0"));

            $addData = [];
            foreach($args['addfields'] as $addfield)
                $addData[$addfield] = $memberAccount->$addfield;

            $aclActions = ['list', 'detail', 'edit', 'delete', 'export'];
            foreach ($aclActions as $aclAction) {
                $addData['acl'][$aclAction] = $memberAccount->ACLAccess($aclAction);
            }

            $hierarchy[] = [
                'id' => $memberAccount->id,
                'summary_text' => $memberAccount->get_summary_text(),
                'member_count' => $memberCount['membercount'],
                'data' => $addData
            ];
        }

        return $res->withJson($hierarchy);
    }
}