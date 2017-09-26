<?php
class AttachMailToBeans{
    private $email;
    private $addresses;
    private $beans;
    private $skip = true;

    function processMail(Email $mail){
        global $sugar_config;
        if(isset($sugar_config['developerMode']) && $sugar_config['developerMode']) $GLOBALS['log']->fatal("AttachMailToBeans mail: ".$mail->subject);
        $this->email = $mail;
        $this->checkAuthFrom();
        if(isset($sugar_config['developerMode']) && $sugar_config['developerMode']) $GLOBALS['log']->fatal("AttachMailToBeans inbound_processing_allowed: ".!$this->skip);
        if($this->skip) exit;
        $this->getAddresses();
        $this->findBeans();
        $this->findRelatedBeans();
        $this->linkMailToBeans();
    }

    private function checkAuthFrom(){
        global $db;
        $addr = explode(', ',$this->email->from_addr);
        $sql = "SELECT u.id FROM users u INNER JOIN email_addr_bean_rel eb ON eb.bean_id = u.id AND eb.bean_module = 'Users' AND u.inbound_processing_allowed = 1 INNER JOIN email_addresses ea ON ea.id = eb.email_address_id AND ea.email_address_caps = '{$addr[0]}' WHERE u.deleted = 0 AND eb.deleted = 0 AND ea.deleted = 0";
        $res = $db->query($sql);
        while($row = $db->fetchByAssoc($res))$this->skip = false;
    }

    private function getAddresses(){
        global $sugar_config;
        $this->email->retrieveEmailAddresses();
        $this->addresses = array_merge(explode(', ',$this->email->from_addr),explode(', ',$this->email->to_addrs),explode(', ',$this->email->cc_addrs),explode(', ',$this->email->bcc_addrs));
        $this->getAddressesFromTxt($this->email->description);
        $this->getAddressesFromTxt($this->email->description_html);
        $this->addresses = array_unique($this->addresses);
        if(isset($sugar_config['developerMode']) && $sugar_config['developerMode']) {
            $GLOBALS['log']->fatal("AttachMailToBeans getAddresses: " . implode(" , ",$this->addresses));
        }
    }

    private function getAddressesFromTxt($txt){
        $return = array();
        $res = preg_match_all(
            "/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/i",
            $txt,
            $matches
        );
        if ($res) {
            $return = array_unique($matches[0]);
        }
        $this->addresses = array_merge($return,$this->addresses);
    }

    private function findBeans(){
        global $sugar_config;
        global $db;
        $addr_string = "'".strtoupper(implode("','",$this->addresses))."'";
        $sql = "SELECT eb.bean_id, eb.bean_module FROM email_addresses ea INNER JOIN email_addr_bean_rel eb ON eb.email_address_id = ea.id WHERE ea.email_address_caps IN ($addr_string) AND ea.deleted = 0 AND eb.deleted = 0";
        $res = $db->query($sql);
        while($row = $db->fetchByAssoc($res)){
            if($this->beanCheck($row)) {
                $this->beans[] = $row;
                if(isset($sugar_config['developerMode']) && $sugar_config['developerMode']) {
                    $GLOBALS['log']->fatal("AttachMailToBeans findBeans: " . $row['bean_module'] . "/" . $row['bean_id']);
                }
            }
        }
    }

    private function beanCheck($data){
        if($data['bean_module'] == 'Leads'){
            require_once('data/BeanFactory.php');
            $bean = BeanFactory::getBean($data['bean_module'],$data['bean_id']);
            if($bean->status != 'Converted' && $bean->status != 'Dead'){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    }

    private function findRelatedBeans(){
        global $sugar_config;
        global $db;
        foreach ($this->beans as $idx => $bean){
            if($bean['bean_module'] == 'Contacts'){
                $sql = "SELECT o.id FROM opportunities o INNER JOIN opportunities_contacts oc ON oc.opportunity_id = o.id AND o.sales_stage NOT IN ('Closed Won','Closed Lost') AND oc.contact_id = '{$bean['bean_id']}' WHERE oc.deleted = 0 AND o.deleted = 0";
                $res = $db->query($sql);
                while($row = $db->fetchByAssoc($res)){
                    $this->beans[] = array('bean_module' => 'Opportunities', 'bean_id' => $row['id']);
                    if(isset($sugar_config['developerMode']) && $sugar_config['developerMode']) {
                        $GLOBALS['log']->fatal("AttachMailToBeans findRelatedBeans: Opportunities/" . $row['id']);
                    }
                }
            }
        }
    }

    private function linkMailToBeans(){
        global $sugar_config;
        global $db;
        foreach ($this->beans as $bean){
            $db->query("INSERT INTO emails_beans (id, email_id, bean_id, bean_module, date_modified) VALUES (UUID(), '{$this->email->id}', '{$bean['bean_id']}', '{$bean['bean_module']}', NOW());");
            if(isset($sugar_config['developerMode']) && $sugar_config['developerMode']) {
                $GLOBALS['log']->fatal("AttachMailToBeans linkMailToBeans: " . $bean['bean_module'] . "/" . $bean['bean_id']);
            }
        }
    }
}