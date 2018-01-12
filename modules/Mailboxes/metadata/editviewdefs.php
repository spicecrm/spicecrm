<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER ****/

$viewdefs['Mailboxes']['EditView'] = array(
    'templateMeta' => array(
        'form' => array(
            'buttons' => array(
                'SAVE',
                'CANCEL',
                array(
//                    'customCode' => '<input type="button" name="test-connectivity_imap_pop3" value="Test connectivity imap or pop3">',
                    'sugar_html' => array(
                        'type' => 'submit',
                        'value' => '{$MOD.LBL_TEST_CONN_IMAP_POP3_BUTTON}',

                        'htmlOptions' => array(
                            'title' => 'test_connectivity_imap_pop3',
                            'class' => 'button',
                            'onclick' => 'event.preventDefault(); mailboxesEditView.test_connection_imap_pop3() ;return false;',
                            'name' => 'test_connection_imap_pop3',
                            'id' => 'test_conn_imap_pop3',
                        ),
                        'template' => '[CONTENT]',
                    )
                ),
                array(
                    'sugar_html' => array(
                        'type' => 'submit',
                        'value' => '{$MOD.LBL_TEST_CONN_SMTP_BUTTON}',

                        'htmlOptions' => array(
                            'title' => 'test_connectivity_smtp',
                            'class' => 'button',
                            'onclick' => 'event.preventDefault(); mailboxesEditView.test_connection_smtp(); return true;',
                            'name' => 'test_connection_smtp',
                            'id' => 'test_connection_smtp',
                        ),
                        'template' => '[CONTENT]',
                    )
                ),
                array(
                    'sugar_html' => array(
                        'type' => 'submit',
                        'value' => '{$MOD.LBL_SEND_EMAIL_BUTTON}',

                        'htmlOptions' => array(
                            'title' => 'send_email',
                            'class' => 'button',
                            'onclick' => 'event.preventDefault(); mailboxesEditView.send_email(); return true;',
                            'name' => 'send_email',
                            'id' => 'send_email',
                        ),
                        'template' => '[CONTENT]',
                    )
                )
            ),
            'hidden' => array(
                '<input type="hidden" name="imap_pop3_data_valid" value="{$fields.imap_pop3_data_valid.value}" id="imap_pop3_data_valid">
                 <input type="hidden" name="smtp_data_valid" value="{$fields.smtp_data_valid.value}" id="smtp_data_valid">
                <!--dynamicky menit pri kazdej datovej zmene-->
                <span id="succes_msg" style="color:green"></span>
                 <span id="error_msg" style="color:red"></span>
                 <div id="email_dialog_div" style="display: none"><input type="email" id="email_address"><br><button id="dialog_btn_send" onclick="mailboxesEditView.confirm_send_email()">Send</button></div>'
            )
        ),
        'includes' => array(
            array('file' => 'modules/Mailboxes/js/editview.js'),
        ),
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
        'useTabs' => false,
        'tabDefs' => array(         //definuje nam nase taby v ktorych mame panely (imap_pop3 a smtp tab)
            'LBL_MAINDATA' => array(
                'newTab' => true
            ),
            'LBL_PANEL_ASSIGNMENT' => array(
                'newTab' => true
            )
        ),
        'javascript' => ''
    ),
    'panels' => array(
        'LBL_MAILBOX' =>
            array(
                array(
                    array('name' => 'name'),
                    array('name' => 'description')
                ),
                array(
                    array(
                        'name' => 'relais',
                        'label' => 'LBL_RELAIS',
                        'customCode' => '<select id="relais" name="sysmailrelais_id">{{$RELAIS_OPTIONS}}</select>'
                    ),
                )
            ),
        'LBL_IMAP_POP3' => array(
            array(
                array(
                    'name' => 'imap_pop3_host',
                    'label' => 'LBL_HOST'
                ),
                array(
                    'name' => 'imap_pop3_port',
                    'label' => 'LBL_PORT'
                ),
            ),
            array(
                array(
                    'name' => 'imap_pop3_username',
                    'label' => 'LBL_USERNAME'
                ),
                array(
                    'name' => 'imap_pop3_password',
                    'label' => 'LBL_PASSWORD',
                    'type' => 'password'
                ),
            ),
            array(
                array('name' => 'imap_pop3_protocol_type'),
                array('name' => 'imap_pop3_encryption'),
            ),
            array(
                array(
                    'name' => 'imap_inbox_dir',
                    'customCode' => '<input type="text" readonly name="imap_inbox_dir" value="{$fields.imap_inbox_dir.value}" id="imap_inbox_dir">
                                                                    <input value="Choose" type="button" id="imap_inbox_dir_button">'
                ),
            )
        ),

        'LBL_SMTP' => array(
            array(
                array(
                    'name' => 'smtp_host',
                    'label' => 'LBL_HOST'
                ),
                array(
                    'name' => 'smtp_port',
                    'label' => 'LBL_PORT'
                ),
            ),
            array(
                array(
                    'name' => 'smtp_username',
                    'label' => 'LBL_USERNAME'
                ),
                array(
                    'name' => 'smtp_password',
                    'label' => 'LBL_PASSWORD',
                    'type' => 'password'
                ),
            ),
            array(
                array('name' => 'smtp_auth_type')
            )
        ),

    ),
);
?>