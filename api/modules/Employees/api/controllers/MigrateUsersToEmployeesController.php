<?php

namespace SpiceCRM\modules\Employees\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class MigrateUsersToEmployeesController {

    public function migrateFromUsers(Request $req, Response $res, array $args): Response {

        // get all Users
        $bean = BeanFactory::getBean('Users');
        $users = $bean->get_full_list();

        // loop and create employee record
        foreach($users as $user){
            // skip admin user
            if($user->user_name == 'admin' || $user->is_api_user || $user->status == 'Inactive'){
                continue;
            }

            // check if you already have an employee record for that user
            $existingEmployee = $user->get_linked_beans('employee');
            if(count($existingEmployee) > 0){
                continue;
            }
            // origin field => target field
            $mapConvert = [
                'address_street' => 'primary_address_street',
                'address_street_number' => 'primary_address_street_number',
                'address_street_number_suffix' => 'primary_address_street_number_suffix',
                'address_attn' => 'primary_address_attn',
                'address_street_2' => 'primary_address_street_2',
                'address_street_3' => 'primary_address_street_3',
                'address_city' => 'primary_address_city',
                'address_district' => 'primary_address_district',
                'address_state' => 'primary_address_state',
                'address_postalcode' => 'primary_address_postalcode',
                'address_pobox' => 'primary_address_pobox',
                'address_country' => 'primary_address_country',
                'address_latitude' => 'primary_address_latitude',
                'address_longitude' => 'primary_address_longitude',
            ];
            $employee = $user->convertBeanToBean($user, 'Employees', $mapConvert);
            $employee->save();
            $user->parent_id = $employee->id;
            $user->parent_type = $employee->_module;
            $response[] = $employee->id;

            // move relationship from User record to Employee record
            $absences = $user->get_linked_beans('userabsences');
            foreach($absences as $absence){
                $absence->employee_id = $employee->id;
                $absence->save();
            }
        }


        return $res->withJson(['status' => 'success', 'data' => $response ?: []]);
    }
}

