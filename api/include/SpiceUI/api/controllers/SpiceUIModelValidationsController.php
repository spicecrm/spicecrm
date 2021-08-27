<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceUIModelValidationsController
{
    static function getAllModelValidations()
    {
        $db = DBManagerFactory::getInstance();
        $sql = "SELECT id, module
                FROM sysuimodelvalidations 
                WHERE deleted = 0 AND active = 1
                ORDER BY priority ASC";
        $res = $db->query($sql);
        while($row = $db->fetchByAssoc($res))
        {
            $return[$row['module']]['validations'][] = self::getModelValidations($row['id']);
        }
        return $return;
    }

    static function getModelValidations($id)
    {
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT * FROM sysuimodelvalidations WHERE id = '{$id}'";
        $res = $db->query($sql);
        $return = $db->fetchByAssoc($res);
        if( !$return['logicoperator'] ){    $return['logicoperator'] = 'and';   }
        if( json_decode($return['onevents']) ){$return['onevents'] = json_decode($return['onevents']);}

        $return['conditions'] = $return['actions'] = [];

        $sql = "SELECT * FROM sysuimodelvalidationconditions 
                WHERE sysuimodelvalidation_id = '{$return['id']}' AND deleted = 0";
        $res = $db->query($sql);
        while($row = $db->fetchByAssoc($res))
        {
            try {
                $decoded = json_decode( $row['valuations'] );
                $row['valuations'] = $decoded ?: $row['valuations'];
            } catch( Exception $e ) {
                $row['valuations'] = $row['valuations'];
            }
            $return['conditions'][] = $row;
        }

        $sql = "SELECT * FROM sysuimodelvalidationactions 
                WHERE sysuimodelvalidation_id = '{$return['id']}' AND deleted = 0
                ORDER BY priority ASC";
        $res = $db->query($sql);
        while($row = $db->fetchByAssoc($res))  // <--- fucking dont encode html entities...!!!
        {
            if( json_decode($row['params']) ){$row['params'] = json_decode($row['params']);}
            $return['actions'][] = $row;
        }

        return $return;
    }

}
