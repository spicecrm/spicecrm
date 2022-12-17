<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Mailbox'] = [
    'table' => 'mailboxes',
    'audited' => false,
    'unified_search' => true,
    'full_text_search' => true,
    'unified_search_default_enabled' => true,
    'duplicate_merge' => false,

    'fields' => [
        'transport' => [
            'name' => 'transport',
            'vname' => 'LBL_TRANSPORT',
            'type' => 'mailboxtransport',
            'dbtype' => 'varchar',
            'len' => 15,
            //'options' => 'mailboxes_transport_dom',
            'comment' => 'Mailbox transport method'
        ],
        'inbound_comm' => [
            'name' => 'inbound_comm',
            'vname' => 'LBL_INBOUND_COMM',
            'type' => 'bool',
            'comment' => 'Inbound communication permitted flag',
        ],
        'outbound_comm' => [
            'name' => 'outbound_comm',
            'vname' => 'LBL_OUTBOUND_COMM',
            'type' => 'enum',
            'len' => 15,
            'options' => 'mailboxes_outbound_comm',
            'comment' => 'Outbound communication type'
        ],
        'last_checked' => [
            'name' => 'last_checked',
            'vname' => 'LBL_LAST_CHECKED',
            'type' => 'datetime',
            'audited' => false,
            'comment' => 'Date when the emails were fetched the last time',
        ],
        'settings' => [
            'name' => 'settings',
            'vname' => 'LBL_SETTINGS',
            'type' => 'json',
            'dbType' => 'text',
            'comment' => 'JSON containing all the mailbox settings',
        ],
        'mailbox_header' => [
            'name' => 'mailbox_header',
            'vname' => 'LBL_HEADER',
            'type' => 'html',
            'dbType' => 'text',
            'comment' => 'A header that will be added to all emails sent from a mailbox',
        ],
        'mailbox_footer' => [
            'name' => 'mailbox_footer',
            'vname' => 'LBL_FOOTER',
            'type' => 'html',
            'dbType' => 'text',
            'comment' => 'A footer that will be added to all emails sent from a mailbox',
        ],
        'is_default' => [
            'name' => 'is_default',
            'vname' => 'LBL_DEFAULT_MAILBOX',
            'type' => 'bool',
            'comment' => 'System default mailbox flag',
        ],
        'active' => [
            'name' => 'active',
            'vname' => 'LBL_ACTIVE',
            'type' => 'bool',
            'default' => true,
            'comment' => 'Mailbox active flag',
        ],
        'hidden' => [
            'name' => 'hidden',
            'vname' => 'LBL_HIDDEN',
            'type' => 'bool',
            'default' => false,
            'comment' => 'Mailbox hidden flag',
        ],
        'catch_all_address' => [
            'name' => 'catch_all_address',
            'vname' => 'LBL_CATCH_ALL_ADDRESS',
            'type' => 'varchar',
            'comment' => 'Catch All address for debugging',
        ],
        'track_mailbox' => [
            'name' => 'track_mailbox',
            'vname' => 'LBL_TRACK_MAILBOX',
            'type' => 'bool',
            'default' => false,
            'comment' => 'Flag to enable tracking',
        ],
        'tracking_url' => [
            'name' => 'tracking_url',
            'vname' => 'LBL_TRACKING_URL',
            'type' => 'varchar',
            'len' => 255,
            'comment' => 'tracking url of the Mailbox',
        ],
        'emails' => [
            'name' => 'emails',
            'vname' => 'LBL_EMAILS_LINK',
            'type' => 'link',
            'relationship' => 'mailboxes_emails_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
            'module' => 'Emails',
            'bean_name' => 'Email',
        ],
        'sysmailrelais_id' => [
            'name' => 'sysmailrelais_id',
            'vname' => 'LBL_SYSMAILRELAIS_ID',
            'type' => 'varchar',
            'comment' => 'FK to SYSMAILRELAIS',
        ],
        'actionset' => [
            'name' => 'actionset',
            'vname' => 'LBL_ACTIONSET',
            'type' => 'actionset',
            'dbtype' => 'varchar',
            'len' => '36'
        ],
        'stylesheet' => [
            'name' => 'stylesheet',
            'vname' => 'LBL_STYLESHEET',
            'type' => 'id',
            'len' => '36',
        ],
        //link to the campaigns
        'campaigns' => [
            'name' => 'campaigns',
            'vname' => 'LBL_CAMPAIGNS_LINK',
            'type' => 'link',
            'relationship' => 'campaigns_mailboxes_rel',
            'link_type' => 'one',
            'source' => 'non-db',
            'duplicate_merge' => 'disabled',
        ],
        //link to the users
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'module' => 'Users',
            'type' => 'link',
            'relationship' => 'mailboxes_users',
            'link_type' => 'one',
            'source' => 'non-db'
        ],
        'mailbox_processors' => [
            'name' => 'mailbox_processors',
            'source' => 'non-db',
        ],
        'mailboxprocessors' => [
            'name' => 'mailboxprocessors',
            'type' => 'link',
            'module' => 'MailboxProcessors',
            'relationship' => 'mailboxes_mailbox_processors',
            'source' => 'non-db',
            'default' => true,
        ],
        'log_level' => [
            'name' => 'log_level',
            'vname' => 'LBL_LOG_LEVEL',
            'type' => 'enum',
            'len' => 1,
            'options' => 'mailboxes_log_levels',
        ],
        'email_signature' => [
            'vname' => 'LBL_EMAIL_SIGNATURE',
            'name' => 'email_signature',
            'type' => 'html',
        ],
    ],
    'relationships' => [
        'mailboxes_emails_rel' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Emails',
            'rhs_table' => 'emails',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],
        'campaigns_mailboxes_rel' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'Campaigns',
            'rhs_table' => 'campaigns',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many',
        ],
        'users' => [
            'vname' => 'LBL_USERS',
            'name' => 'users',
            'type' => 'link',
            'module' => 'Users',
            'bean_name' => 'User',
            'relationship' => 'mailboxes_users',
            'source' => 'non-db'
        ],
        'mailboxes_mailbox_processors' => [
            'lhs_module' => 'Mailboxes',
            'lhs_table' => 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module' => 'MailboxProcessors',
            'rhs_table' => 'mailbox_processors',
            'rhs_key' => 'mailbox_id',
            'relationship_type' => 'one-to-many'
        ],

    ],
    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

VardefManager::createVardef('Mailboxes', 'Mailbox', ['default', 'assignable']);
