<?php

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 * 
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 * 
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

class KRESTUserHandler
{

    public function getPwdCheckRegex()
    {
        $pwdCheck = '';
        if ( @$GLOBALS['sugar_config']['passwordsetting']['oneupper'] )
            $pwdCheck .= '(?=.*[A-Z])';
        if ( @$GLOBALS['sugar_config']['passwordsetting']['onelower'] )
            $pwdCheck .= '(?=.*[a-z])';
        if ( @$GLOBALS['sugar_config']['passwordsetting']['onenumber'] )
            $pwdCheck .= '(?=.*\d)';
        if ( @$GLOBALS['sugar_config']['passwordsetting']['minpwdlength'] )
            $pwdCheck .= '.{'.$GLOBALS['sugar_config']['passwordsetting']['minpwdlength'].',}';
        else
            $pwdCheck .= '.+';
        return $pwdCheck;
    }

    public function getPwdGuideline( $lang ) {
        return (string) @$GLOBALS['sugar_config']['passwordsetting']['guideline'][$lang];
    }


    public function get_modules_acl()
    {
        global $moduleList;

        $actions = array('list', 'view', 'edit');

        $retModules = array();

        foreach (ACLController::disabledModuleList($moduleList) as $disabledModule)
            unset($moduleList[$disabledModule]);

        foreach ($moduleList as $module) {
            $retModules[$module]['acl']['enabled'] = ACLController::moduleSupportsACL($module);
            if ($retModules[$module]['acl']['enabled']) {
                foreach ($actions as $action)
                    $retModules[$module]['acl'][$action] = ACLController::checkAccess($module, $action);
            }
        }

        return $retModules;
    }

    public function set_password($data)
    {
        global $db, $current_user;

        $authController = new AuthenticationController();
        $isLoginSuccess = $authController->login($current_user->user_name, $data['currentpwd'], array('passwordEncrypted' => false));
        if ($isLoginSuccess) {
            $current_user->setNewPassword($data['newpwd']);
            return array(
                'status' => 'success',
                'msg' => 'new password set'
            );
        } else {
            return array(
                'status' => 'error',
                'msg' => 'current password not OK',
                'lbl' => 'MSG_CURRENT_PWD_NOT_OK'
            );
        }
    }


    public function get_user_preferences($category)
    {
        global $current_user;
        require_once 'modules/UserPreferences/UserPreference.php';
        $userPreference = new UserPreference($current_user);

        $prefArray = array();

        $userPreference->loadPreferences($category);

        return $_SESSION[$current_user->user_name . '_PREFERENCES'][$category];
    }

    public function get_user_preference($category, $names)
    {
        global $current_user;
        require_once 'modules/UserPreferences/UserPreference.php';
        $userPreference = new UserPreference($current_user);

        $prefArray = array();

        $namesArray = json_decode($names);
        if (!is_array($namesArray))
            $namesArray = [$names];

        foreach ($namesArray as $name)
            $prefArray[$name] = $userPreference->getPreference($name, $category);

        return $prefArray;
    }

    public function set_user_preferences($category, $preferences)
    {

        global $current_user;
        require_once 'modules/UserPreferences/UserPreference.php';
        $userPreference = new UserPreference($current_user);

        // do the magci
        foreach ($preferences as $name => $value) {
            $userPreference->setPreference($name, $value, $category);
        }

        return true;
    }

    public function sendTokenToUser($email)
    {
        global $db, $timedate, $sugar_config;
        $result = array();
        $user_id = '';
        $res = $db->query("SELECT u.id FROM users u INNER JOIN email_addr_bean_rel rel ON rel.bean_id = u.id AND rel.bean_module = 'Users' AND rel.primary_address = 1 INNER JOIN email_addresses ea ON ea.id = rel.email_address_id AND ea.email_address_caps = '" . strtoupper($email) . "' WHERE u.deleted = 0 AND rel.deleted = 0 AND ea.deleted = 0");
        while ($row = $db->fetchByAssoc($res)) $user_id = $row['id'];

        if (!empty($user_id)) {
            $token = reset($db->fetchByAssoc($db->limitQuery("SELECT uuid() FROM users", 0, 1)));
            $sql = "INSERT INTO users_password_tokens (id, user_id, date_generated) VALUES ('$token', '$user_id', '" . $timedate->asDb(new DateTime('now')) . "');";
            $db->query($sql);

            $emailTemp = new EmailTemplate();
            $emailTemp->retrieve($sugar_config['passwordsetting']['tokentmpl']);
            $emailTemp->disable_row_level_security = true;

            //workaround till we know where to store the template id
            //$emailTemp->subject = 'Password reset Token';
            //$emailTemp->body_html = 'Return to $config_site_url and enter the Token: $token';
            //$emailTemp->body = 'Return to $config_site_url and enter the Token: $token';

            //replace instance variables in email templates
            $htmlBody = $emailTemp->body_html;
            $body = $emailTemp->body;

            $htmlBody = str_replace('$config_site_url', $sugar_config['site_url'], $htmlBody);
            $body = str_replace('$config_site_url', $sugar_config['site_url'], $body);

            $htmlBody = str_replace('$token', $token, $htmlBody);
            $body = str_replace('$token', $token, $body);
            $emailTemp->body_html = $htmlBody;
            $emailTemp->body = $body;

            $emailObj = new Email();
            $defaults = $emailObj->getSystemDefaultEmail();
            require_once('include/SugarPHPMailer.php');
            $mail = new SugarPHPMailer();
            $mail->setMailerForSystem();
            //$mail->IsHTML(true);
            $mail->From = $defaults['email'];
            $mail->FromName = $defaults['name'];
            $mail->clearAllRecipients();
            $mail->clearReplyTos();
            $mail->Subject = from_html($emailTemp->subject);
            if ($emailTemp->text_only != 1) {
                $mail->isHTML(true);
                $mail->Body = from_html($emailTemp->body_html);
                $mail->AltBody = from_html($emailTemp->body);
            } else {
                $mail->Body_html = from_html($emailTemp->body_html);
                $mail->Body = from_html($emailTemp->body);
            }

            $mail->prepForOutbound();

            $mail->addAddress($email);

            $result['status'] = @$mail->send();

            if ($result['status'] == true) {
                $emailObj->team_id = 1;
                $emailObj->to_addrs = '';
                $emailObj->type = 'archived';
                $emailObj->deleted = '0';
                $emailObj->name = $mail->Subject;
                $emailObj->description = $mail->Body;
                $emailObj->description_html = null;
                $emailObj->from_addr = $mail->From;
                $emailObj->parent_type = 'User';
                $emailObj->date_sent = TimeDate::getInstance()->nowDb();
                $emailObj->modified_user_id = '1';
                $emailObj->created_by = '1';
                $emailObj->status = 'sent';
                $emailObj->save();
            }

            return $result;
        }
    }

    public function checkToken($email,$token){
        global $db, $sugar_config;

        //check if user exists
        $user_id = "";
        $res = $db->query("SELECT u.id FROM users u INNER JOIN email_addr_bean_rel rel ON rel.bean_id = u.id AND rel.bean_module = 'Users' AND rel.primary_address = 1 INNER JOIN email_addresses ea ON ea.id = rel.email_address_id AND ea.email_address_caps = '" . strtoupper($email) . "' WHERE u.deleted = 0 AND rel.deleted = 0 AND ea.deleted = 0");
        while ($row = $db->fetchByAssoc($res)) $user_id = $row['id'];

        //check if Token is valid
        $token_valid = false;
        $res = $db->query("SELECT * FROM users_password_tokens WHERE user_id = '$user_id' AND id = '$token' AND date_generated < CURRENT_TIMESTAMP - INTERVAl ".$sugar_config['passwordsetting']['tokenexpire']." MINUTE");
        while($row = $db->fetchByAssoc($res)) $token_valid = true;

        return array("token_valid" => $token_valid);
    }

    public function resetPass($data){
        global $db, $sugar_config, $current_user;

        //check if user exists
        $user_id = "";
        $res = $db->query("SELECT u.id FROM users u INNER JOIN email_addr_bean_rel rel ON rel.bean_id = u.id AND rel.bean_module = 'Users' AND rel.primary_address = 1 INNER JOIN email_addresses ea ON ea.id = rel.email_address_id AND ea.email_address_caps = '" . strtoupper($data['email']) . "' WHERE u.deleted = 0 AND rel.deleted = 0 AND ea.deleted = 0");
        while ($row = $db->fetchByAssoc($res)) $user_id = $row['id'];

        //check if Token is valid
        $token_valid = false;
        $res = $db->query("SELECT * FROM users_password_tokens WHERE user_id = '$user_id' AND id = '".$data['token']."' AND date_generated < CURRENT_TIMESTAMP - INTERVAl ".$sugar_config['passwordsetting']['tokenexpire']." MINUTE");
        while($row = $db->fetchByAssoc($res)) $token_valid = true;

        if(!empty($data['password']) && $token_valid && !empty($user_id)){
            $user = BeanFactory::getBean("Users",$user_id);
            $user->setNewPassword($data['password']);
            $accessLog = BeanFactory::getBean('UserAccessLogs');
            $accessLog->addRecord('pwdreset');
        }

        //for set new password for users with system generated passwords
        if(!empty($current_user->id) && !empty($data['password'])){
            $current_user->setNewPassword($data['password'], 0);
            $accessLog = BeanFactory::getBean('UserAccessLogs');
            $accessLog->addRecord('pwdreset');
        }

        return true;
    }
}
