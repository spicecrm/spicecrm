<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

$dictionary['syststatusnetworks'] = [
    'table' => 'syststatusnetworks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'domain' => [
            'name' => 'domain',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_from' => [
            'name' => 'status_from',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_to' => [
            'name' => 'status_to',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_priority' => [
            'name' => 'status_priority',
            'type' => 'int'
        ],
        'action_label' => [
            'name' => 'action_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'status_component' => [
            'name' => 'status_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'prompt_label' => [
            'name' => 'prompt_label',
            'type' => 'varchar',
            'len' => 100
        ],
        'required_model_state' => [
            'name' => 'required_model_state',
            'type' => 'varchar',
            'len' => 100
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syststatusnetworks',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
