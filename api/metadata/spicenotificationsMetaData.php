<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['spicenotifications'] = [
    'table'  => 'spicenotifications',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'len'  => '36',
        ],
        'bean_module' => [
            'name' => 'bean_module',
            'type' => 'varchar',
            'len'  => '50',
            'comment' => 'the module'
        ],
        'bean_id' => [
            'name' => 'bean_id',
            'type' => 'id',
            'len'  => '36',
            'comment' => 'the id of the bean'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id',
            'len'  => '36',
            'comment' => 'the id of the user that is being notified'
        ],
        'created_by' => [
            'name' => 'created_by',
            'type' => 'id',
            'len'  => '36',
            'comment' => 'the id of the user originating the notification'
        ],
        'notification_date' => [
            'name' => 'notification_date',
            'type' => 'datetime',
            'comment' => 'the date and time when the notification has been created'
        ],
        'notification_type' => [
            'name' => 'notification_type',
            'type' => 'varchar',
            'len'  => '24',
            'comment' => 'the type of notification'
        ],
        'notification_read' => [
            'name' => 'notification_read',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'indicates that the user has read the notification'
        ],
        'additional_infos' => [
            'name'    => 'additional_infos',
            'type'    => 'json',
            'dbType'  => 'text',
            'comment' => 'a json that holds the additional infos required for the notification text'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'delete indicatior'
        ]
    ],
    'indices' => [
        [
            'name'   => 'spicenotifications_pk',
            'type'   => 'primary',
            'fields' => ['id'],
        ],
    ],
];
