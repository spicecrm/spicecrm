<?php
/*
$dictionary['syscountries'] = array(
    'table' => 'syscountries',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'cca2' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 2
        ),
        'cca3' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 3
        ),
        'ccn3' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 3
        ),
        'label' => array(
            'name' => 'label',
            'type' => 'varchar',
            'len' => 14
        ),
        'rank' => array(
            'name' => 'rank',
            'type' => 'int',
            'default' => 50,
        ),
    ),
    'indices' => array(
        array(
            'name' => 'idx_syscountries',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_syssystags_rank',
            'type' => 'index',
            'fields' => array('rank')
        ),
    ),
);

$dictionary['syscountrystates'] = array(
    'table' => 'syscountrystates',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'syscountry_id' => array(
            'name' => 'syscountry_id',
            'type' => 'varchar',
            'len' => 36,
        ),
        'csc' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 10,
        ),
        'label' => array(
            'name' => 'label',
            'type' => 'varchar',
            'len' => 25,
        ),
        'rank' => array(
            'name' => 'rank',
            'type' => 'int',
            'default' => 50,
        ),
    ),
    'indices' => array(
        array(
            'name' => 'idx_syscountrystates',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_syscountrystates_rank',
            'type' => 'index',
            'fields' => array('rank')
        ),
    )
);
*/