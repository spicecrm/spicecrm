<?php
namespace SpiceCRM\modules\EmailAddresses;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;

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
                if($seed = BeanFactory::getBean($row['bean_module'], $row['bean_id'])) {
                    $results[$row['bean_id']] = [
                        'selected' => false,
                        'id' => $row['bean_id'],
                        'module' => $row['bean_module'],
                        'data' => $moduleHandler->mapBeanToArray($row['bean_module'], $seed)
                    ];
                }
            }
        }

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
