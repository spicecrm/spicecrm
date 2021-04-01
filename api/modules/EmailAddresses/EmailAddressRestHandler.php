<?php
namespace SpiceCRM\modules\EmailAddresses;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;

// require_once('KREST/handlers/ModuleHandler.php');

class EmailAddressRestHandler
{
    public static function searchBeans($params) {
        $db = DBManagerFactory::getInstance();

        $moduleHandler = new ModuleHandler();

        $results = [];

        if (isset($params['addresses'])) {
            $i = 1;
            $sql = "SELECT rel.bean_id, rel.bean_module 
                    FROM email_addr_bean_rel rel 
                    LEFT JOIN email_addresses addr ON rel.email_address_id = addr.id 
                    WHERE rel.deleted = 0 AND addr.deleted = 0 AND (";

            foreach ($params['addresses'] as $address) {
                $sql .= "addr.email_address_caps LIKE '%" . strtoupper($address) . "%' ";

                if ($i < sizeof($params['addresses'])) {
                    $sql .= "OR ";
                }

                ++$i;
            }

            $sql .= ")";

            $query = $db->query($sql);
            while ($row = $db->fetchByAssoc($query)) {

                $seed = BeanFactory::getBean($row['bean_module'], $row['bean_id']);

                $results[$row['bean_id']] = [
                    'selected' => false,
                    'id'       => $row['bean_id'],
                    'module'   => $row['bean_module'],
                    'data'     => $moduleHandler->mapBeanToArray($row['bean_module'], $seed)
                ];
            }
        }

        /*
        if (isset($params['message_id'])) {
            $sql2 = "SELECT rel.bean_id, rel.bean_module
                FROM emails_beans rel 
                LEFT JOIN emails em ON rel.email_id = em.id 
                WHERE em.message_id = '" . filter_var($params['message_id'], FILTER_SANITIZE_STRING) . "'
                AND rel.deleted = 0";

            $query2 = $db->query($sql2);
            while ($row2 = $db->fetchByAssoc($query2)) {
                $results[$row2['bean_id']] = [
                    'selected' => true,
                    'id'       => $row2['bean_id'],
                    'module'   => $row2['bean_module'],
                ];
            }
        }
        */

        foreach ($results as $bean_id => $result) {
            $bean = BeanFactory::getBean($result['module'], $bean_id);
            if($bean) {
                $results[$bean_id]['summary_text'] = $bean->get_summary_text();
            } else {
                unset($results[$bean_id]);
            }
        }

        return $results;
    }
}
