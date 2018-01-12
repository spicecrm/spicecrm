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

/**
 * Class KDeploymentMWNotification
 * Send notification to users when maintenance window is about to load
 * Time before is set in config.php
 * Default 10 Minutes
 */
require_once 'modules/KDeploymentMWs/KDeploymentMW.php';

class KDeploymentMWNotification{

    public function __construct(){

    }


    public function checkAndNotify(){
        KDeploymentMW::checkMW();
        if(isset($GLOBALS['kdeploymentmw_near']) && $GLOBALS['kdeploymentmw_near']['disable_login'] && !$GLOBALS['kdeploymentmw_near']['notified']){
            if($success = $this->sendNotifications()){
                //set notified Flag in MaintenanceWindow
                $mw = BeanFactory::getBean("KDeploymentMWs", $GLOBALS['kdeploymentmw_near']['id']);
                $mw->notified = $success;
                $mw->save();
            }
        }
    }


    public function sendNotifications(){
        global $locale;

        //common variables for each e-mail
        $OBCharset = $locale->getPrecedentPreference('default_email_charset');
        $admin = new Administration();
        $admin->retrieveSettings();
        $from = array(
            'email' => $admin->settings['notify_fromaddress'],
            'name' => $admin->settings['notify_fromname']
        );

        //get active Users
        $user = BeanFactory::newBean("Users");
        $order_by = "";
        $where = "users.status='Active'";
        $userlist = $user->get_full_list($order_by, $where);

        //BEGIN testing: get some users
        //$u1 = BeanFactory::getBean('Users', 'seed_chris_id');
        //$u2 = BeanFactory::getBean('Users', 'seed_jim_id');
        //$userlist = array($u1, $u2);
        //END

        //send e-mail to each User (to each one because of timezone information)
        $notifications = array();
        foreach($userlist as $idx => $user){
            $user->email1 = $user->emailAddress->getPrimaryAddress($user);
            $notifications[] = $this->notify($user, $from, $OBCharset);
        }
        unset($userlist);

        //consider success if at least 1 successful notification found
        if(in_array(true, $notifications))
            return true;
        return false;
    }


    public function notify($recipient, $from, $OBCharset){
        $success = false;

        require_once("include/SugarPHPMailer.php");
        global $locale;
        $mail = new SugarPHPMailer();
        $mail->isHTML(true);
        $mail->setMailerForSystem();
        $mail->From = $from['email'];
        $mail->FromName = $from['name'];

        //build for mail content
        $this->populateMail($mail, $recipient);

        $oe = new OutboundEmail();
        $oe = $oe->getSystemMailerSettings();
        if ( empty($oe->mail_smtpserver) ) {
            $errmsg = "Maintenance Window user notification: error sending email, system smtp server is not set";
            $GLOBALS['log']->fatal($errmsg);
            $errors[] = array('errmsg' => $errmsg);
        }

        if(!empty($oe->mail_smtpserver) ) {
            //to
            $mail->clearAddresses();
            $mail->addAddress($recipient->email1, $locale->translateCharsetMIME(trim($recipient->full_name), 'UTF-8', $OBCharset));

            $mail->prepForOutbound();
            if (!$mail->send()) {
                $errmsg = "Maintenance Window User notification: error sending e-mail (method: {$mail->Mailer}), (error: {$mail->ErrorInfo})";
                $GLOBALS['log']->fatal($errmsg);
                $errors[] = array('errmsg' => $errmsg);
            }
            $success = true;
        }
        unset($mail);

        return $success;
    }


    public function populateMail($mail, $recipient){
        global $timedate;

        $sm = new Sugar_Smarty();

        $tpl = "modules/KDeploymentMWs/tpls/en_us.notifywm.tpl";
        if(file_exists("custom/".$tpl))
            $tpl = "custom/".$tpl;

        //format time to default system timezone
        $user_timezone = $recipient->getPreference('timezone');
        $user_datef = $recipient->getPreference('datef');
        $user_timef = $recipient->getPreference('timef');

        $dt = new DateTime();
        $from_date = $dt->createFromFormat($timedate->get_db_date_time_format(),$GLOBALS['kdeploymentmw_near']['from_date'],new DateTimeZone('UTC'));
        $from_date->setTimezone(new DateTimeZone($user_timezone));
        $to_date = $dt->createFromFormat($timedate->get_db_date_time_format(),$GLOBALS['kdeploymentmw_near']['to_date'],new DateTimeZone('UTC'));
        $to_date->setTimezone(new DateTimeZone($user_timezone));

        $sm->assign("from_date", $from_date->format($user_datef." ".$user_timef));
        $sm->assign("to_date", $to_date->format($user_datef." ".$user_timef));
        $sm->assign("description", $GLOBALS['kdeploymentmw_near']['description']);

        $mail->Body = from_html($sm->fetch($tpl));

        //assign generic subject if none given
        $mail->Subject = $GLOBALS['kdeploymentmw_near']['name'];

    }
}
