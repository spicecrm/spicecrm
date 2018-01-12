<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/
require_once("include/phpmailer/PHPMailerAutoload.php");

class MailboxesController extends SugarController
{
    public function __construct()
    {
        parent::__construct();
    }

    function getImapDir ($mbox,$host) {
        $imap_dir = [];
        $list = imap_list($mbox, "{ $host }", "*");

        if (is_array($list)) {
            foreach ($list as $val) {
                array_push($imap_dir, str_replace("{ $host }", "", imap_utf7_decode($val)));
            }
        }
        imap_close($mbox);
        return $imap_dir;
    }

    function action_test_connection_imap_pop3()
    {
        $log_data = $_GET;

        $port = ":" . $log_data["imap_pop3_port"];

        if ($log_data["imap_pop3_encryption"] == 'ssl_enable') $crypt = "/ssl";
        else {
            $crypt = "";
            $port = "";
        }
        if ($log_data["imap_pop3_port"] == null) {
            $port = "";
        }

        $mailbox = "{" . $log_data["imap_pop3_host"] . $port . "/" . $log_data["imap_pop3_protocol_type"] . $crypt . "}";

        $inbox = imap_open($mailbox, $log_data["imap_pop3_username"], $log_data["imap_pop3_password"]) or false;

        $valid = false;
        $imap_dir = [];

        if ($inbox != false) {
            $imap_dir = $this->getImapDir($inbox,$log_data['imap_pop3_host']);
            //echo json_encode($imap_dir);
            $valid = true;
        }


        header("Content-type: text/javascript");
        echo json_encode(array('valid'=>$valid,'dirs'=>$imap_dir));
        header("Content-type: text/php");

        //echo print_r($_GET,true);

        return true;
    }


    function action_test_connection_smtp()
    {
        $auth_type = $_GET["smtp_auth_type"];
        $is_auth_required = ($auth_type !== "NO_AUTH");

        $mail = new PHPMailer();
        $mail->isSMTP(); // enable SMTP
        $mail->SMTPDebug = $_GET["smtp_debug"];
        $mail->SMTPSecure = $auth_type;
        $mail->SMTPAuth = $is_auth_required;
        $mail->Host = $_GET["smtp_host"];
        $mail->Port = $_GET["smtp_port"];
        $mail->Username = $_GET["smtp_username"];
        $mail->Password = $_GET["smtp_password"];
        echo $mail->smtpConnect();
    }

    function action_send_email($data)
    {
        $auth_type = $_GET["smtp_auth_type"];
        $is_auth_required = ($auth_type !== "NO_AUTH");

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->SMTPDebug = $_GET["smtp_debug"]; //
        $mail->SMTPSecure = $auth_type;
        $mail->SMTPAuth = $is_auth_required;
        $mail->Host = $_GET["smtp_host"];
        $mail->Port = $_GET["smtp_port"];
        $mail->Username = $_GET["smtp_username"];
        $mail->Password = $_GET["smtp_password"];

        $mail->addAddress($_GET["email_address"]);
        $email_bean = $this->senderDetailsFromDB();
        $mail->setFrom($email_bean->from_address, $email_bean->from_name);

        global $mod_strings;
        $mail->Subject = $mod_strings['EMAIL_SUBJECT'];
        $mail->Body = $mod_strings['EMAIL_BODY'];

        try {
            $mail->send();
        } catch (phpmailerException $e) {
            echo $e->errorMessage();
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    function senderDetailsFromDB() {
        global $db;
        $email_bean = new EmailBean;
        $email_beanSettingsRes = $db->query("SELECT * FROM config WHERE category='notify' AND name like 'from%'");
        while ($email_beanDetails = $db->fetchByAssoc($email_beanSettingsRes)) {
            switch ($email_beanDetails['name']) {
                case 'fromname':
                    $email_bean->from_name = $email_beanDetails['value'];
                    break;
                case 'fromaddress':
                    $email_bean->from_address = $email_beanDetails['value'];
                    break;
            }
        }
        return $email_bean;
    }
}

class EmailBean
{
    public $from_name;
    public $from_address;
}

?>